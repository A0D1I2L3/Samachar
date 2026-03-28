import { useGameStore } from "../store/gameStore";

const RISK_COLORS = {
  low: "#4ade80",
  medium: "#facc15",
  high: "#f87171",
};

const EVIDENCE_LABELS = {
  strong: { label: "STRONG", color: "#4ade80" },
  moderate: { label: "MODERATE", color: "#facc15" },
  weak: { label: "WEAK", color: "#f87171" },
};

export default function StoryPanel() {
  const { currentStory, makeDecision, phase } = useGameStore();

  if (!currentStory) return null;

  const evidenceCfg = EVIDENCE_LABELS[currentStory.evidence] ?? EVIDENCE_LABELS.moderate;
  const riskColor = RISK_COLORS[currentStory.riskLevel] ?? "#facc15";

  return (
    <div className="story-panel">
      <div className="story-meta-row">
        <span className="story-tag">BREAKING STORY</span>
        <span
          className="story-risk"
          style={{ color: riskColor, borderColor: riskColor }}
        >
          {currentStory.riskLevel.toUpperCase()} RISK
        </span>
      </div>

      <h1 className="story-title">{currentStory.title}</h1>

      <div className="story-scores">
        <ScorePill label="TRUTH SCORE" value={currentStory.truthScore} max={100} color="#60a5fa" />
        <ScorePill label="VIRALITY" value={currentStory.viralityScore} max={100} color="#c084fc" />
        <div className="evidence-pill" style={{ borderColor: evidenceCfg.color }}>
          <span className="pill-label">EVIDENCE</span>
          <span className="pill-val" style={{ color: evidenceCfg.color }}>
            {evidenceCfg.label}
          </span>
        </div>
      </div>

      {phase === "decision" && (
        <div className="decision-section">
          <p className="decision-prompt">— Your call, Editor —</p>
          <div className="decision-buttons">
            <DecisionButton
              label="PUBLISH"
              desc="Run the story as-is"
              onClick={() => makeDecision("publish")}
              color="#4ade80"
            />
            <DecisionButton
              label="REJECT"
              desc="Kill the story"
              onClick={() => makeDecision("reject")}
              color="#f87171"
            />
            <DecisionButton
              label="SPIN"
              desc="Reframe for impact"
              onClick={() => makeDecision("spin")}
              color="#facc15"
            />
            <DecisionButton
              label="DELAY"
              desc="Hold for more evidence"
              onClick={() => makeDecision("delay")}
              color="#60a5fa"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ScorePill({ label, value, color }) {
  return (
    <div className="score-pill">
      <span className="pill-label">{label}</span>
      <span className="pill-val" style={{ color }}>
        {value}
      </span>
      <div className="mini-bar-track">
        <div
          className="mini-bar-fill"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function DecisionButton({ label, desc, onClick, color }) {
  return (
    <button
      className="decision-btn"
      style={{ "--btn-color": color }}
      onClick={onClick}
    >
      <span className="btn-label">{label}</span>
      <span className="btn-desc">{desc}</span>
    </button>
  );
}
