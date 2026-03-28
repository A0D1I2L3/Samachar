import React from "react";
import { PARAMS } from "../engine/constants.js";

function clamp(v) { return Math.max(0, Math.min(100, v)); }

function BarStat({ paramKey, value, prevValue }) {
  const p = PARAMS[paramKey];
  const delta = prevValue != null ? value - prevValue : 0;
  const pct = clamp(value);
  const danger = value <= p.collapseAt + 8;
  const great  = value >= p.achieveAt - 8;
  const barColor = danger ? "#ef4444" : great ? "#22c55e" : p.color;

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
        <span
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", color: "#94a3b8",
          }}
        >
          {p.icon} {p.symbol}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          {delta !== 0 && (
            <span
              style={{
                fontSize: 10, fontWeight: 700,
                color: delta > 0 ? "#22c55e" : "#ef4444",
                animation: "fadeIn 0.4s ease",
              }}
            >
              {delta > 0 ? "+" : ""}{delta}
            </span>
          )}
          <span style={{ fontSize: 12, fontWeight: 800, color: danger ? "#ef4444" : "#e2e8f0" }}>
            {Math.round(value)}
          </span>
        </div>
      </div>
      <div style={{ height: 5, background: "#1e293b", borderRadius: 3, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: barColor,
            borderRadius: 3,
            transition: "width 0.9s cubic-bezier(0.4,0,0.2,1), background 0.5s",
          }}
        />
      </div>
      {danger && (
        <div style={{ fontSize: 8, color: "#ef4444", marginTop: 2, fontWeight: 700, letterSpacing: "0.05em" }}>
          COLLAPSE RISK
        </div>
      )}
    </div>
  );
}

export default function ParameterBar({ scores, prevScores }) {
  return (
    <div
      style={{
        background: "#0f172a",
        borderRadius: 10,
        padding: "12px 16px",
        display: "flex",
        gap: 14,
        alignItems: "flex-start",
        border: "1px solid #1e293b",
      }}
    >
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#475569", whiteSpace: "nowrap", paddingTop: 2 }}>
        Newsroom<br />Status
      </div>
      {Object.keys(PARAMS).map((key) => (
        <BarStat
          key={key}
          paramKey={key}
          value={scores[key]}
          prevValue={prevScores ? prevScores[key] : null}
        />
      ))}
    </div>
  );
}
