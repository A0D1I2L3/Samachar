import React, { useState, useEffect, useCallback } from "react";
import { PARAMS } from "../engine/constants.js";
import { useSettings } from "../context/SettingsContext.jsx";

function getDeltaLabel(delta) {
  if (delta >= 15) return { text: "↑ Surging", color: "#1a5a1a" };
  if (delta >= 6) return { text: "↑ Stronger", color: "#2a7a2a" };
  if (delta >= 1) return { text: "↑ Growing", color: "#3a8a3a" };
  if (delta === 0) return { text: "→ Holding", color: "#64748b" };
  if (delta >= -5) return { text: "↓ Slipping", color: "#8b6a1a" };
  if (delta >= -14) return { text: "↓ Under Pressure", color: "#8b4a1a" };
  return { text: "↓ Critical", color: "#8b1a1a" };
}

export default function ConsequenceScreen({
  partA,
  onContinue,
  isGameOver,
  isVictory,
  dayNumber,
}) {
  const { theme, settings } = useSettings();
  const [phase, setPhase] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200), // masthead
      setTimeout(() => setPhase(2), 800), // consequences
      setTimeout(() => setPhase(3), 2200), // score shifts
      setTimeout(() => setPhase(4), 3200), // achievement/collapse
      setTimeout(() => setPhase(5), 4000), // button
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleContinue = useCallback(() => {
    setExiting(true);
    setTimeout(onContinue, 420);
  }, [onContinue]);

  const { score_updates, consequences, achievement, collapse } = partA;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bgColor,
        backgroundImage: `radial-gradient(${theme.dotColor} 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
        fontFamily: theme.font,
        color: theme.textColor,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px 60px",
        opacity: exiting ? 0 : 1,
        transition: exiting ? "opacity 0.4s ease" : "none",
      }}
    >
      <div style={{ maxWidth: 760, width: "100%" }}>
        {/* ── Masthead ── */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 28,
            borderTop: `3px double ${theme.textColor}`,
            borderBottom: `3px double ${theme.textColor}`,
            padding: "14px 0",
            opacity: phase >= 1 ? 1 : 0,
            transform:
              phase >= 1
                ? "translateY(0) scale(1)"
                : "translateY(-16px) scale(0.97)",
            transition:
              "opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div
            style={{
              fontFamily: theme.mono,
              fontSize: 10,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: theme.subColor,
              marginBottom: 6,
            }}
          >
            {settings.paperName}
          </div>
          <div
            style={{
              fontFamily: theme.font,
              fontSize: 36,
              fontWeight: 900,
              color: theme.textColor,
              letterSpacing: "-0.5px",
            }}
          >
            The Paper Lands.
          </div>
          <div
            style={{
              fontFamily: theme.font,
              fontSize: 11,
              fontStyle: "italic",
              color: theme.subColor,
              marginTop: 4,
            }}
          >
            Day {dayNumber} consequences — filed by the editors
          </div>
        </div>

        {/* ── Consequences ── */}
        {phase >= 2 && (
          <div>
            {consequences.map((c, i) => (
              <div
                key={c.story_id || i}
                style={{
                  padding: "16px 0",
                  borderBottom: `1px solid ${theme.cardBorder}`,
                  animation: `consequence-reveal 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 220}ms both`,
                }}
              >
                <div
                  style={{
                    fontFamily: theme.mono,
                    fontSize: 8,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: theme.subColor,
                    marginBottom: 6,
                  }}
                >
                  {c.slot_name ||
                    ["Lead Story", "Secondary", "Side", "Buried"][i] ||
                    `Story ${i + 1}`}
                </div>
                <p
                  style={{
                    margin: 0,
                    fontFamily: theme.font,
                    fontSize: 14,
                    lineHeight: 1.8,
                    color: theme.textColor,
                    fontStyle: "italic",
                    borderLeft: `3px solid ${theme.cardBorder}`,
                    paddingLeft: 14,
                  }}
                >
                  {c.narrative}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ── What shifted today (directional only, NO numbers) ── */}
        {phase >= 3 && score_updates && (
          <div
            style={{
              marginTop: 32,
              animation: "fadeInUp 0.55s cubic-bezier(0.16,1,0.3,1) both",
            }}
          >
            <div
              style={{
                fontFamily: theme.mono,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: theme.subColor,
                marginBottom: 12,
                borderBottom: `2px solid ${theme.textColor}`,
                paddingBottom: 8,
              }}
            >
              What Shifted Today
            </div>
            {Object.entries(score_updates).map(([key, update], i) => {
              const p = PARAMS[key];
              const dl = getDeltaLabel(update.delta);
              return (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "9px 0",
                    borderBottom: `1px solid ${theme.cardBorder}`,
                    animation: `fadeIn 0.45s ease ${i * 90}ms both`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: theme.font,
                      fontSize: 12,
                      fontWeight: 700,
                      color: theme.textColor,
                    }}
                  >
                    {p?.label || key}
                  </span>
                  <span
                    style={{
                      fontFamily: theme.mono,
                      fontSize: 13,
                      fontWeight: 800,
                      color: dl.color,
                      animation:
                        update.delta !== 0
                          ? "score-tick 0.45s cubic-bezier(0.34,1.56,0.64,1) both"
                          : "none",
                    }}
                  >
                    {dl.text}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Achievement ── */}
        {phase >= 4 && achievement && (
          <div
            style={{
              marginTop: 24,
              background: theme.cardBg,
              border: `2px solid #1a5a1a`,
              borderLeft: `5px solid #1a5a1a`,
              padding: "16px 20px",
              animation: "fadeInUp 0.55s cubic-bezier(0.16,1,0.3,1) both",
            }}
            className="achievement-card"
          >
            <div
              style={{
                fontFamily: theme.mono,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#1a5a1a",
                marginBottom: 6,
              }}
            >
              ◆ Achievement Unlocked
            </div>
            <div
              style={{
                fontFamily: theme.font,
                fontSize: 17,
                fontWeight: 700,
                color: theme.textColor,
                marginBottom: 5,
              }}
            >
              {achievement.name}
            </div>
            <p
              style={{
                margin: 0,
                fontFamily: theme.font,
                fontSize: 13,
                color: theme.subColor,
                lineHeight: 1.65,
                fontStyle: "italic",
              }}
            >
              {achievement.description}
            </p>
          </div>
        )}

        {/* ── Collapse ── */}
        {phase >= 4 && collapse && (
          <div
            style={{
              marginTop: 24,
              background: theme.cardBg,
              border: `2px solid #8b1a1a`,
              borderLeft: `5px solid #8b1a1a`,
              padding: "16px 20px",
              animation: "fadeInUp 0.55s cubic-bezier(0.16,1,0.3,1) both",
            }}
            className="collapse-card"
          >
            <div
              style={{
                fontFamily: theme.mono,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#8b1a1a",
                marginBottom: 6,
              }}
            >
              ▼ Collapse Event
            </div>
            <div
              style={{
                fontFamily: theme.font,
                fontSize: 17,
                fontWeight: 700,
                color: "#8b1a1a",
                marginBottom: 5,
              }}
            >
              {collapse.name}
            </div>
            <p
              style={{
                margin: 0,
                fontFamily: theme.font,
                fontSize: 13,
                color: theme.subColor,
                lineHeight: 1.65,
                fontStyle: "italic",
              }}
            >
              {collapse.description}
            </p>
          </div>
        )}

        {/* ── Continue ── */}
        {phase >= 5 && (
          <button
            onClick={handleContinue}
            style={{
              marginTop: 36,
              width: "100%",
              background: theme.textColor,
              color: theme.bgColor,
              border: "none",
              padding: "16px",
              fontFamily: theme.mono,
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              animation: "fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) both",
              transition:
                "opacity 0.15s, transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.85";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 22px rgba(0,0,0,0.22)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "scale(0.98)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
          >
            {isGameOver
              ? "▼ Read the Epilogue"
              : isVictory
                ? "◆ See Your Ending"
                : `◆ Day ${dayNumber + 1} Begins →`}
          </button>
        )}
      </div>
    </div>
  );
}
