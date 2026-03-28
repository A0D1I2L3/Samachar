import React, { useState, useEffect } from "react";
import { PARAMS } from "../engine/constants.js";

function ScoreLine({ paramKey, update }) {
  const p = PARAMS[paramKey];
  const delta = update.delta;
  const dir = delta > 0 ? "▲" : delta < 0 ? "▼" : "—";
  const col = delta > 0 ? "#22c55e" : delta < 0 ? "#ef4444" : "#94a3b8";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "9px 0",
        borderBottom: "1px solid #1e293b",
        animation: "fadeIn 0.5s ease",
      }}
    >
      <span
        style={{
          minWidth: 120,
          fontSize: 12,
          fontWeight: 700,
          color: "#e2e8f0",
        }}
      >
        {p.icon} {p.label}
      </span>
      <span style={{ fontSize: 12, color: "#64748b", minWidth: 80 }}>
        {update.previous} →{" "}
        <strong style={{ color: "#e2e8f0" }}>{update.new}</strong>
      </span>
      <span style={{ fontSize: 13, fontWeight: 800, color: col, minWidth: 50 }}>
        {delta > 0 ? "+" : ""}
        {delta} {dir}
      </span>
      <span
        style={{ fontSize: 11, color: "#475569", fontStyle: "italic", flex: 1 }}
      >
        {update.note}
      </span>
    </div>
  );
}

export default function ConsequenceScreen({
  partA,
  onContinue,
  isGameOver,
  isVictory,
  dayNumber,
}) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2200),
      setTimeout(() => setPhase(4), 3400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const { score_updates, consequences, achievement, collapse } = partA;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#e2e8f0",
        fontFamily: "'Helvetica Neue', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "40px 20px 60px",
      }}
    >
      <div style={{ maxWidth: 760, width: "100%" }}>
        {/* Masthead divider */}
        {phase >= 1 && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div
                style={{ height: 2, background: "#e2e8f0", marginBottom: 10 }}
              />
              <div
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#64748b",
                  marginBottom: 10,
                }}
              >
                THE EDITOR
              </div>
              <div
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: 32,
                  fontWeight: 900,
                  color: "#fff",
                  marginBottom: 6,
                }}
              >
                THE PAPER LANDS.
              </div>
              <div style={{ height: 2, background: "#e2e8f0" }} />
            </div>

            {/* 4 consequences */}
            {consequences.map((c, i) => (
              <div
                key={c.slot}
                style={{
                  padding: "14px 0",
                  borderBottom: "1px solid #1e293b",
                  animation: `fadeIn 0.5s ease ${i * 0.18}s both`,
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: "#475569",
                    marginBottom: 5,
                  }}
                >
                  SLOT {c.slot} CONSEQUENCE
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    lineHeight: 1.75,
                    color: "#cbd5e1",
                    fontStyle: "italic",
                  }}
                >
                  "{c.narrative}"
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Score update */}
        {phase >= 2 && (
          <div style={{ marginTop: 36, animation: "fadeIn 0.6s ease" }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#64748b",
                marginBottom: 12,
                borderBottom: "1px solid #1e293b",
                paddingBottom: 8,
              }}
            >
              Score Update — Day {dayNumber}
            </div>
            {Object.entries(score_updates).map(([key, update]) => (
              <ScoreLine key={key} paramKey={key} update={update} />
            ))}
          </div>
        )}

        {/* Achievement */}
        {phase >= 3 && achievement && (
          <div
            style={{
              marginTop: 24,
              background: "#14532d",
              border: "1px solid #22c55e",
              borderRadius: 8,
              padding: "16px 20px",
              animation: "fadeIn 0.6s ease",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#22c55e",
                marginBottom: 6,
              }}
            >
              🏆 ACHIEVEMENT UNLOCKED
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: "#fff",
                marginBottom: 6,
              }}
            >
              {achievement.name}
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "#86efac",
                lineHeight: 1.6,
              }}
            >
              {achievement.description}
            </p>
          </div>
        )}

        {/* Collapse event */}
        {phase >= 3 && collapse && (
          <div
            style={{
              marginTop: 24,
              background: "#450a0a",
              border: "1px solid #ef4444",
              borderRadius: 8,
              padding: "16px 20px",
              animation: "fadeIn 0.6s ease",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#ef4444",
                marginBottom: 6,
              }}
            >
              💀 COLLAPSE EVENT
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: "#fff",
                marginBottom: 6,
              }}
            >
              {collapse.name}
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "#fca5a5",
                lineHeight: 1.6,
              }}
            >
              {collapse.description}
            </p>
          </div>
        )}

        {/* Continue button */}
        {phase >= 4 && (
          <button
            onClick={onContinue}
            style={{
              marginTop: 36,
              width: "100%",
              background: isGameOver ? "#7f1d1d" : "#1e3a2f",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "16px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              animation: "fadeIn 0.5s ease",
            }}
          >
            {isGameOver
              ? "☠ Read the Epilogue"
              : isVictory
                ? "🏆 See Your Ending"
                : `◆ Day ${dayNumber + 1} Begins →`}
          </button>
        )}
      </div>
    </div>
  );
}
