import { SYSTEM_PROMPT } from "./constants.js";

// ─── API KEY ──────────────────────────────────────────────────────────────────
// Set VITE_GROK_API_KEY in your .env file:
//   VITE_GROK_API_KEY=xai-your-key-here
const GROK_API_KEY = import.meta.env.VITE_GROK_API_KEY || "";

// ─── BUILD REQUEST PAYLOAD ────────────────────────────────────────────────────
function buildPayload(gameState) {
  const {
    day,
    scores,
    slots,        // { slot_1_headline: story|null, slot_2_secondary: story|null, ... }
    factors,      // [{ factor_id, name, type, pressure, description, player_response }]
    arcFlags,     // string[]
  } = gameState;

  const bentoLayout = {};
  Object.entries(slots).forEach(([slotId, story]) => {
    if (story) {
      bentoLayout[slotId] = {
        story_id: story.story_id,
        title: story.headline,
        sensitivity: story.slot_sensitivity,
        explosive_rating: story.explosive_rating,
      };
    }
  });

  const userContent = {
    day,
    current_scores: scores,
    bento_layout: bentoLayout,
    external_factors_active: factors.map((f) => ({
      factor_id: f.factor_id,
      name: f.name,
      type: f.type,
      pressure: f.pressure,
      player_response: f.player_response || "ignored",
    })),
    arc_flags: arcFlags,
  };

  return {
    model: "llama-3.3-70b-versatile",
    max_tokens: 4000,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: JSON.stringify(userContent) },
    ],
  };
}

// ─── PROCESS EDITOR TURN ─────────────────────────────────────────────────────
export async function processEditorTurn(gameState) {
  if (!GROK_API_KEY) {
    throw new Error("NO_API_KEY");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROK_API_KEY}`,
    },
    body: JSON.stringify(buildPayload(gameState)),
  });

  if (!response.ok) {
    const err = await response.text().catch(() => "");
    throw new Error(`Grok API ${response.status}: ${err.slice(0, 200)}`);
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content || "";

  // Strip markdown fences if model wraps in ```json
  const clean = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

  let result;
  try {
    result = JSON.parse(clean);
  } catch {
    throw new Error(`Failed to parse Grok response: ${clean.slice(0, 300)}`);
  }

  return {
    partA: result.part_a,
    partB: result.part_b,
  };
}

// ─── CLAMP SCORES ────────────────────────────────────────────────────────────
export function applyScoreUpdates(currentScores, scoreUpdates) {
  const next = { ...currentScores };
  Object.entries(scoreUpdates).forEach(([key, update]) => {
    next[key] = Math.max(0, Math.min(100, update.new ?? currentScores[key]));
  });
  return next;
}
