import React, { useState, useEffect } from "react";
import { PARAMS, COLLAPSE_ENDINGS, WIN_CONDITIONS } from "../engine/constants.js";

const FALLBACK_ENDING = {
  emoji: "⚖",
  title: "Uneasy Peace",
  epilogue: "The story ran — partially. The investigation continues — slowly. The acquisition happened — conditionally. Morgan still sits in the same chair. The coffee is still bad. The phones still ring. Nobody won. Nobody lost. The city still has a paper. For now, that has to be enough. Some days, Morgan believes it. Most days are not some days.",
};

export default function EndingScreen({ scores, collapseKey, dayNumber, arcFlags, onRestart }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2800),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  // Resolve which ending applies
  let ending;
  if (collapseKey) {
    ending = COLLAPSE_ENDINGS[collapseKey] || COLLAPSE_ENDINGS.CASCADE;
  } else {
    const win = WIN_CONDITIONS.find((w) => w.check(scores));
    if (win) {
      ending = { emoji: win.emoji, title: win.title, epilogue: win.epilogue };
    } else {
      ending = FALLBACK_ENDING;
    }
  }

  const isCollapse = !!collapseKey;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: isCollapse ? "#0a0a0a" : "#0f172a",
        color: "#e2e8f0",
        fontFamily: "'Georgia', serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px 64px",
      }}
    >
      <div style={{ maxWidth: 680, width: "100%" }}>

        {phase >= 1 && (
          <div style={{ textAlign: "center", marginBottom: 40, animation: "fadeIn 0.8s ease" }}>
            <div style={{ fontSize: 72, marginBottom: 16 }}>{ending.emoji}</div>
            <div
              style={{
                fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase",
                color: "#475569", marginBottom: 12,
              }}
            >
              After {dayNumber} {dayNumber === 1 ? "day" : "days"} — your ending
            </div>
            <h1
              style={{
                fontSize: 36, fontWeight: 900, color: "#fff",
                margin: "0 0 0", lineHeight: 1.1,
              }}
            >
              {ending.title}
            </h1>
          </div>
        )}

        {/* Final scores grid */}
        {phase >= 2 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 8, marginBottom: 32,
              animation: "fadeIn 0.6s ease",
            }}
          >
            {Object.entries(PARAMS).map(([key, p]) => {
              const v = scores[key] ?? 0;
              const danger = v <= p.collapseAt + 8;
              return (
                <div
                  key={key}
                  style={{
                    background: "#1e293b",
                    border: `1px solid ${danger ? "#ef444433" : "#ffffff11"}`,
                    borderRadius: 8,
                    padding: "12px 6px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 18, color: p.color, marginBottom: 4 }}>{p.icon}</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: danger ? "#ef4444" : "#fff" }}>{Math.round(v)}</div>
                  <div style={{ fontSize: 7, letterSpacing: "0.08em", color: "#475569", textTransform: "uppercase", marginTop: 2 }}>{p.symbol}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Epilogue */}
        {phase >= 3 && (
          <div style={{ animation: "fadeIn 0.8s ease" }}>
            <div
              style={{
                height: 1, background: "#1e293b", marginBottom: 24,
              }}
            />
            {ending.epilogue.split("\n\n").map((para, i) => (
              <p
                key={i}
                style={{
                  fontSize: 15, lineHeight: 1.9, color: "#94a3b8",
                  marginBottom: 18, fontStyle: "italic",
                }}
              >
                {para}
              </p>
            ))}

            {arcFlags && arcFlags.length > 0 && (
              <div
                style={{
                  background: "#1e293b",
                  borderRadius: 6,
                  padding: "12px 16px",
                  marginBottom: 24,
                  fontSize: 10,
                  color: "#475569",
                  letterSpacing: "0.05em",
                }}
              >
                <strong style={{ color: "#64748b" }}>ARC FLAGS TRIGGERED: </strong>
                {arcFlags.join(" · ")}
              </div>
            )}

            <button
              onClick={onRestart}
              style={{
                width: "100%",
                background: "#1e293b",
                color: "#fff",
                border: "1px solid #334155",
                borderRadius: 8,
                padding: "16px",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginTop: 8,
              }}
            >
              ← Run the Paper Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
