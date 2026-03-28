import { useGameStore } from "../store/gameStore";

const METRIC_CONFIG = {
  trust: { label: "Public Trust", icon: "◈", color: "#4ade80", warnBelow: 25 },
  revenue: { label: "Revenue", icon: "◆", color: "#facc15", warnBelow: 20 },
  safety: { label: "Newsroom Safety", icon: "◉", color: "#60a5fa", warnBelow: 20 },
  legalRisk: { label: "Legal Risk", icon: "⚠", color: "#f87171", warnAbove: 75, inverted: true },
  politicalPressure: {
    label: "Political Pressure",
    icon: "◎",
    color: "#c084fc",
    warnAbove: 70,
    inverted: true,
  },
};

function MetricBar({ metricKey, value }) {
  const cfg = METRIC_CONFIG[metricKey];
  const isWarning =
    (cfg.warnBelow && value <= cfg.warnBelow) ||
    (cfg.warnAbove && value >= cfg.warnAbove);

  return (
    <div className="metric-bar">
      <div className="metric-header">
        <span className="metric-icon" style={{ color: cfg.color }}>
          {cfg.icon}
        </span>
        <span className="metric-label">{cfg.label}</span>
        <span className={`metric-value ${isWarning ? "warning" : ""}`}>
          {value}
          <span className="metric-max">/100</span>
        </span>
      </div>
      <div className="bar-track">
        <div
          className="bar-fill"
          style={{
            width: `${value}%`,
            backgroundColor: isWarning ? "#ef4444" : cfg.color,
            boxShadow: isWarning
              ? `0 0 8px #ef444488`
              : `0 0 6px ${cfg.color}55`,
          }}
        />
      </div>
    </div>
  );
}

export default function MetricsDashboard() {
  const { metrics, day } = useGameStore();

  return (
    <aside className="metrics-panel">
      <div className="metrics-header">
        <span className="day-badge">DAY {day}</span>
        <h2 className="metrics-title">NEWSROOM STATUS</h2>
      </div>
      <div className="metrics-list">
        {Object.keys(METRIC_CONFIG).map((key) => (
          <MetricBar key={key} metricKey={key} value={metrics[key]} />
        ))}
      </div>
      <div className="metrics-footer">
        <p className="footer-hint">
          Trust or Revenue at 0 = shutdown. Legal Risk at 100 = lawsuit.
        </p>
      </div>
    </aside>
  );
}
