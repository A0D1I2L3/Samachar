import { useGameStore } from "../store/gameStore";

const DECISION_LABELS = {
  publish: "PUBLISHED",
  reject: "REJECTED",
  spin: "SPUN",
  delay: "DELAYED",
};

const DECISION_COLORS = {
  publish: "#4ade80",
  reject: "#f87171",
  spin: "#facc15",
  delay: "#60a5fa",
};

function DeltaBadge({ label, value }) {
  if (value === 0) return null;
  const positive = value > 0;
  return (
    <div className={`delta-badge ${positive ? "delta-pos" : "delta-neg"}`}>
      <span className="delta-label">{label}</span>
      <span className="delta-val">
        {positive ? "+" : ""}
        {value}
      </span>
    </div>
  );
}

export default function ResultPanel() {
  const { lastDecision, advanceToNextStory } = useGameStore();
  if (!lastDecision) return null;

  const { decision, impact } = lastDecision;
  const color = DECISION_COLORS[decision];

  // legalRisk and politicalPressure — positive delta is BAD; invert display sign
  const displayImpact = {
    trust: impact.trust,
    revenue: impact.revenue,
    safety: impact.safety,
    legalRisk: -impact.legalRisk,
    politicalPressure: -impact.politicalPressure,
  };

  const LABELS = {
    trust: "Trust",
    revenue: "Revenue",
    safety: "Safety",
    legalRisk: "Legal Risk",
    politicalPressure: "Pol. Pressure",
  };

  return (
    <div className="result-panel">
      <div className="result-stamp" style={{ color, borderColor: color }}>
        {DECISION_LABELS[decision]}
      </div>

      <p className="result-narrative">{impact.narrative}</p>

      <div className="impact-grid">
        {Object.entries(displayImpact).map(([key, val]) => (
          <DeltaBadge key={key} label={LABELS[key]} value={val} />
        ))}
      </div>

      <button className="next-btn" onClick={advanceToNextStory}>
        NEXT STORY →
      </button>
    </div>
  );
}
