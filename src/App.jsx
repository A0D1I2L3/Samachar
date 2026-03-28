import React, { useState, useCallback } from "react";
import {
  SLOTS,
  INITIAL_SCORES,
  PARAMS,
  DAY_1_SEED,
  WIN_CONDITIONS,
} from "./engine/constants.js";
import { processEditorTurn, applyScoreUpdates } from "./engine/grokApi.js";
import {
  checkCollapses,
  resolveCollapseEnding,
  checkWin,
} from "./engine/scoring.js";

import StoryCard from "./components/StoryCard.jsx";
import BentoSlot from "./components/BentoSlot.jsx";
import ParameterBar from "./components/ParameterBar.jsx";
import ExternalFactorPanel from "./components/ExternalFactorPanel.jsx";
import ConsequenceScreen from "./components/ConsequenceScreen.jsx";
import EndingScreen from "./components/EndingScreen.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";

function makeInitialSlots() {
  return Object.fromEntries(SLOTS.map((s) => [s.id, null]));
}
function makeInitialResponses(factors) {
  return Object.fromEntries(
    (factors || []).map((f) => [f.factor_id, "ignored"]),
  );
}

const MAX_DAYS = 7;

export default function App() {
  const [phase, setPhase] = useState("story_delivery");
  const [dayData, setDayData] = useState(DAY_1_SEED);
  const [dayNumber, setDayNumber] = useState(1);
  const [scores, setScores] = useState({ ...INITIAL_SCORES });
  const [prevScores, setPrevScores] = useState(null);
  const [slots, setSlots] = useState(makeInitialSlots());
  const [draggedStory, setDraggedStory] = useState(null);
  const [factorResponses, setFactorResponses] = useState(
    makeInitialResponses(DAY_1_SEED.external_factors),
  );
  const [arcFlags, setArcFlags] = useState([]);
  const [partA, setPartA] = useState(null);
  const [nextDayData, setNextDayData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [collapseKey, setCollapseKey] = useState(null);
  const [isVictory, setIsVictory] = useState(false);

  const placedIds = new Set(
    Object.values(slots)
      .filter(Boolean)
      .map((s) => s.story_id),
  );
  const availableStories = dayData.stories.filter(
    (s) => !placedIds.has(s.story_id),
  );
  const allSlotsPlaced = SLOTS.every((sl) => slots[sl.id] !== null);
  const placedCount = Object.values(slots).filter(Boolean).length;

  const handleDragStart = useCallback((e, story) => {
    setDraggedStory(story);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDropOnSlot = useCallback(
    (slotId) => {
      if (!draggedStory) return;
      setSlots((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((k) => {
          if (next[k]?.story_id === draggedStory.story_id) next[k] = null;
        });
        next[slotId] = draggedStory;
        return next;
      });
      setDraggedStory(null);
    },
    [draggedStory],
  );

  const handleRemoveFromSlot = useCallback((slotId) => {
    setSlots((prev) => ({ ...prev, [slotId]: null }));
  }, []);

  const handleFactorResponse = useCallback((factorId, response) => {
    setFactorResponses((prev) => ({ ...prev, [factorId]: response }));
  }, []);

  const handlePublish = useCallback(async () => {
    if (!allSlotsPlaced) return;
    setLoading(true);
    setApiError(null);
    setPhase("publishing");

    const factorsWithResponse = dayData.external_factors.map((f) => ({
      ...f,
      player_response: factorResponses[f.factor_id] || "ignored",
    }));

    try {
      const { partA: a, partB: b } = await processEditorTurn({
        day: dayNumber,
        scores,
        slots: {
          slot_1_headline: slots.slot_1_headline,
          slot_2_secondary: slots.slot_2_secondary,
          slot_3_side: slots.slot_3_side,
          slot_4_bottom: slots.slot_4_bottom,
        },
        factors: factorsWithResponse,
        arcFlags,
      });

      const nextScores = applyScoreUpdates(scores, a.score_updates);
      setPrevScores({ ...scores });
      setScores(nextScores);

      const newFlags = b.stories
        .map((s) => s.arc_flag_generated)
        .filter(Boolean);
      setArcFlags((prev) => [...new Set([...prev, ...newFlags])]);

      const collapsed = checkCollapses(nextScores);
      if (collapsed.length > 0) {
        setCollapseKey(collapsed.length >= 2 ? "CASCADE" : collapsed[0]);
        setPartA(a);
        setPhase("consequence");
        setLoading(false);
        return;
      }

      if (dayNumber >= MAX_DAYS) {
        setIsVictory(true);
        setPartA(a);
        setPhase("consequence");
        setLoading(false);
        return;
      }

      setNextDayData(b);
      setPartA(a);
      setPhase("consequence");
    } catch (err) {
      setApiError(err.message || "Unknown error");
      setPhase("error");
    }
    setLoading(false);
  }, [
    allSlotsPlaced,
    dayData,
    dayNumber,
    scores,
    slots,
    factorResponses,
    arcFlags,
  ]);

  const handleContinueFromConsequence = useCallback(() => {
    if (collapseKey || isVictory || dayNumber >= MAX_DAYS) {
      setPhase("ending");
    } else {
      const nextDay = dayNumber + 1;
      setDayNumber(nextDay);
      setDayData(nextDayData);
      setSlots(makeInitialSlots());
      setFactorResponses(makeInitialResponses(nextDayData?.external_factors));
      setPartA(null);
      setNextDayData(null);
      setPhase("story_delivery");
    }
  }, [collapseKey, isVictory, dayNumber, nextDayData]);

  const handleRestart = useCallback(() => {
    setPhase("story_delivery");
    setDayData(DAY_1_SEED);
    setDayNumber(1);
    setScores({ ...INITIAL_SCORES });
    setPrevScores(null);
    setSlots(makeInitialSlots());
    setDraggedStory(null);
    setFactorResponses(makeInitialResponses(DAY_1_SEED.external_factors));
    setArcFlags([]);
    setPartA(null);
    setNextDayData(null);
    setApiError(null);
    setCollapseKey(null);
    setIsVictory(false);
  }, []);

  if (phase === "publishing" || phase === "error") {
    return (
      <LoadingScreen
        error={apiError}
        onRetry={() => {
          setApiError(null);
          setPhase("story_delivery");
        }}
      />
    );
  }

  if (phase === "consequence" && partA) {
    return (
      <ConsequenceScreen
        partA={partA}
        dayNumber={dayNumber}
        isGameOver={!!collapseKey}
        isVictory={isVictory || dayNumber >= MAX_DAYS}
        onContinue={handleContinueFromConsequence}
      />
    );
  }

  if (phase === "ending") {
    return (
      <EndingScreen
        scores={scores}
        collapseKey={collapseKey}
        dayNumber={dayNumber}
        arcFlags={arcFlags}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#1e3a2f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "18px 14px 40px",
        fontFamily: "'Helvetica Neue', sans-serif",
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin   { to { transform: rotate(360deg); } }
      `}</style>

      {/* TOP BAR */}
      <div style={{ width: "100%", maxWidth: 1100, marginBottom: 10 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
            marginBottom: 8,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#86efac",
              }}
            >
              THE EDITOR
            </div>
            <div
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: 22,
                fontWeight: 900,
                color: "#fff",
                lineHeight: 1.1,
              }}
            >
              Day {dayNumber} — {dayData.day_title || "The Editor's Table"}
            </div>
            {dayData.newsroom_atmosphere && (
              <div
                style={{
                  fontSize: 11,
                  color: "#64748b",
                  fontStyle: "italic",
                  marginTop: 3,
                }}
              >
                {dayData.newsroom_atmosphere}
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              gap: 5,
              marginLeft: "auto",
              alignItems: "center",
              paddingTop: 4,
            }}
          >
            {Array.from({ length: MAX_DAYS }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 26,
                  height: 4,
                  borderRadius: 2,
                  background:
                    i < dayNumber - 1
                      ? "#86efac"
                      : i === dayNumber - 1
                        ? "#fff"
                        : "#1e293b",
                  transition: "background 0.3s",
                }}
              />
            ))}
          </div>
        </div>
        <ParameterBar scores={scores} prevScores={prevScores} />
      </div>

      {/* MAIN 3-COLUMN GRID */}
      <div
        style={{
          width: "100%",
          maxWidth: 1100,
          display: "grid",
          gridTemplateColumns: "220px 1fr 230px",
          gap: 14,
          alignItems: "flex-start",
        }}
      >
        {/* LEFT: Story Pool */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: "14px 12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }}
        >
          <div
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: 14,
              fontWeight: 900,
              color: "#0f172a",
              marginBottom: 2,
            }}
          >
            Wire Stories
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#64748b",
              fontStyle: "italic",
              marginBottom: 12,
            }}
          >
            Drag to arrange your front page
          </div>
          {availableStories.length === 0 ? (
            <p
              style={{
                color: "#94a3b8",
                fontSize: 11,
                textAlign: "center",
                padding: "20px 0",
              }}
            >
              All stories placed
            </p>
          ) : (
            availableStories.map((story) => (
              <StoryCard
                key={story.story_id}
                story={story}
                onDragStart={handleDragStart}
                dragging={draggedStory?.story_id === story.story_id}
              />
            ))
          )}
        </div>

        {/* CENTRE: Newspaper */}
        <div
          style={{
            background: "#f5f0e8",
            borderRadius: 10,
            border: "2px solid #c8a96e",
            boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
            overflow: "hidden",
          }}
        >
          {/* Masthead */}
          <div
            style={{
              textAlign: "center",
              padding: "14px 20px 10px",
              borderBottom: "2px solid #c8a96e",
            }}
          >
            <div
              style={{
                fontSize: 34,
                fontWeight: 900,
                fontFamily: "'Georgia', serif",
                letterSpacing: "-0.02em",
                color: "#0f172a",
              }}
            >
              THE EDITOR
            </div>
            <div
              style={{
                fontSize: 10,
                color: "#64748b",
                letterSpacing: "0.04em",
                marginBottom: 6,
              }}
            >
              Truth Without Fear · Est. 1944
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 10,
                color: "#64748b",
                borderTop: "1px solid #d4c5a9",
                paddingTop: 5,
              }}
            >
              <span>Halcyon City · Vol. LXXX</span>
              <span style={{ fontStyle: "italic" }}>Editor: Morgan Voss</span>
              <span>Day {dayNumber} Edition</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "4px 16px",
              background: "#1e293b",
              color: "#e2e8f0",
              fontSize: 10,
              letterSpacing: "0.04em",
            }}
          >
            <span>FIRST EDITION</span>
            <span>
              {4 - placedCount} slot{4 - placedCount !== 1 ? "s" : ""} remaining
            </span>
          </div>

          {/* Bento drop zones */}
          <div style={{ padding: "12px 14px" }}>
            <div style={{ marginBottom: 10 }}>
              <BentoSlot
                slotConfig={SLOTS[0]}
                story={slots.slot_1_headline}
                onDrop={() => handleDropOnSlot("slot_1_headline")}
                onRemove={() => handleRemoveFromSlot("slot_1_headline")}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <BentoSlot
                slotConfig={SLOTS[1]}
                story={slots.slot_2_secondary}
                onDrop={() => handleDropOnSlot("slot_2_secondary")}
                onRemove={() => handleRemoveFromSlot("slot_2_secondary")}
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              <BentoSlot
                slotConfig={SLOTS[2]}
                story={slots.slot_3_side}
                onDrop={() => handleDropOnSlot("slot_3_side")}
                onRemove={() => handleRemoveFromSlot("slot_3_side")}
              />
              <BentoSlot
                slotConfig={SLOTS[3]}
                story={slots.slot_4_bottom}
                onDrop={() => handleDropOnSlot("slot_4_bottom")}
                onRemove={() => handleRemoveFromSlot("slot_4_bottom")}
              />
            </div>
          </div>

          <div style={{ padding: "4px 14px 14px" }}>
            <button
              onClick={handlePublish}
              disabled={!allSlotsPlaced}
              style={{
                width: "100%",
                background: allSlotsPlaced ? "#1e293b" : "#94a3b8",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "14px",
                fontSize: 13,
                fontWeight: 700,
                cursor: allSlotsPlaced ? "pointer" : "not-allowed",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                transition: "background 0.15s",
              }}
            >
              {allSlotsPlaced
                ? "◆ Send to Print"
                : `Fill ${4 - placedCount} more slot${4 - placedCount !== 1 ? "s" : ""} to publish`}
            </button>
          </div>
        </div>

        {/* RIGHT: Factors + multiplier reference */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: "14px 12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }}
        >
          <ExternalFactorPanel
            factors={dayData.external_factors}
            responses={factorResponses}
            onResponse={handleFactorResponse}
            disabled={false}
          />

          <div
            style={{
              borderTop: "1px solid #f1f5f9",
              marginTop: 14,
              paddingTop: 14,
            }}
          >
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#94a3b8",
                marginBottom: 8,
              }}
            >
              Slot Multipliers
            </div>
            {SLOTS.map((sl) => (
              <div
                key={sl.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 10,
                  color: "#64748b",
                  marginBottom: 5,
                }}
              >
                <span>{sl.label}</span>
                <span style={{ fontWeight: 700, color: "#0f172a" }}>
                  ×{sl.multiplier}
                </span>
              </div>
            ))}
            <div
              style={{
                fontSize: 9,
                color: "#94a3b8",
                marginTop: 8,
                lineHeight: 1.6,
                fontStyle: "italic",
              }}
            >
              Same story in Slot 1 vs Slot 4 = 5× different impact on all
              variables.
            </div>
          </div>

          {arcFlags.length > 0 && (
            <div
              style={{
                borderTop: "1px solid #f1f5f9",
                marginTop: 14,
                paddingTop: 14,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#94a3b8",
                  marginBottom: 6,
                }}
              >
                Active Arc Flags
              </div>
              {arcFlags.map((f) => (
                <div
                  key={f}
                  style={{
                    fontSize: 9,
                    color: "#475569",
                    background: "#f8fafc",
                    borderRadius: 3,
                    padding: "3px 7px",
                    marginBottom: 4,
                    fontFamily: "monospace",
                  }}
                >
                  {f}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
