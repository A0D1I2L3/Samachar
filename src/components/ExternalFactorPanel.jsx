import React from "react";

const TYPE_COLORS = {
  political:  { bg: "#dbeafe", color: "#1e40af", icon: "◉" },
  commercial: { bg: "#fef9c3", color: "#854d0e", icon: "$" },
  staff:      { bg: "#fff7ed", color: "#c2410c", icon: "◈" },
  public:     { bg: "#d1fae5", color: "#065f46", icon: "★" },
  personal:   { bg: "#fce7f3", color: "#9d174d", icon: "♦" },
};

const PRESSURE_COLORS = {
  low:      "#22c55e",
  medium:   "#f59e0b",
  high:     "#ef4444",
  critical: "#7c3aed",
};

const RESPONSES = ["ignored", "acknowledged", "appeased"];
const RESPONSE_LABELS = { ignored: "Ignore", acknowledged: "Acknowledge", appeased: "Appease" };
const RESPONSE_DESC = {
  ignored:      "Full pressure applied. May unlock Brave Stand bonus if story is Slot 1.",
  acknowledged: "30% pressure reduction. No additional cost.",
  appeased:     "70% pressure reduction. BUT: −10 Integrity, −8 Morale.",
};

export default function ExternalFactorPanel({ factors, responses, onResponse, disabled }) {
  return (
    <div>
      <div
        style={{
          fontFamily: "'Georgia', serif",
          fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
          color: "#64748b", marginBottom: 10, fontWeight: 700,
        }}
      >
        External Pressures
      </div>
      {factors.map((f) => {
        const tc = TYPE_COLORS[f.type] || TYPE_COLORS.political;
        const response = responses[f.factor_id] || "ignored";
        return (
          <div
            key={f.factor_id}
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderLeft: `4px solid ${PRESSURE_COLORS[f.pressure]}`,
              borderRadius: 8,
              padding: "11px 13px",
              marginBottom: 10,
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span
                style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: "0.07em",
                  textTransform: "uppercase", padding: "2px 6px", borderRadius: 3,
                  background: tc.bg, color: tc.color,
                }}
              >
                {tc.icon} {f.type}
              </span>
              <span
                style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: "0.05em",
                  textTransform: "uppercase", color: PRESSURE_COLORS[f.pressure],
                }}
              >
                {f.pressure} pressure
              </span>
            </div>
            <p style={{ margin: "0 0 5px", fontWeight: 700, fontSize: 12, color: "#0f172a", lineHeight: 1.25 }}>
              {f.name}
            </p>
            <p style={{ margin: "0 0 9px", fontSize: 10.5, color: "#475569", lineHeight: 1.5 }}>
              {f.description}
            </p>

            {/* Response buttons */}
            <div style={{ display: "flex", gap: 5 }}>
              {RESPONSES.map((r) => (
                <button
                  key={r}
                  disabled={disabled}
                  onClick={() => !disabled && onResponse(f.factor_id, r)}
                  title={RESPONSE_DESC[r]}
                  style={{
                    flex: 1,
                    padding: "5px 4px",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    border: response === r ? "2px solid #1e293b" : "1.5px solid #e2e8f0",
                    borderRadius: 5,
                    background: response === r ? "#1e293b" : "#f8fafc",
                    color: response === r ? "#fff" : "#64748b",
                    cursor: disabled ? "not-allowed" : "pointer",
                    transition: "all 0.12s",
                  }}
                >
                  {RESPONSE_LABELS[r]}
                </button>
              ))}
            </div>
            {response === "appeased" && (
              <div style={{ fontSize: 9, color: "#7c3aed", marginTop: 5, fontStyle: "italic" }}>
                ⚠ Appeasement costs −10 INT, −8 MOR
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
