import React, { useState, useEffect, useCallback } from "react";
import { useSettings } from "../context/SettingsContext.jsx";

const DISMISS_LABELS = [
  "Got it →",
  "Noted. Moving on.",
  "This is fine. →",
  "I can handle this.",
  "...okay. →",
  "Adding to my ulcer. →",
];

export default function FactorIntroScreen({
  dayNumber,
  dayTitle,
  atmosphere,
  factors,
  onDone,
}) {
  const { theme } = useSettings();
  const [phase, setPhase] = useState(0); // 0=overlay-in, 1=day, 2=atmos, 3=factors, 4=done-anim
  const [exiting, setExiting] = useState(false);

  // Step-in sequence
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 120);
    const t2 = setTimeout(() => setPhase(2), 650);
    const t3 = setTimeout(() => setPhase(3), 1300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleSkip = useCallback(() => {
    setExiting(true);
    setTimeout(onDone, 380);
  }, [onDone]);

  const pressureColor = (p) =>
    ({
      low: "#2a6a2a",
      medium: "#7a5c2e",
      high: "#8b4a1a",
      critical: "#8b1a1a",
    })[p] || "#64748b";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: theme.bgColor,
        backgroundImage: `radial-gradient(${theme.dotColor} 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        fontFamily: theme.font,
        color: theme.textColor,
        opacity: exiting ? 0 : 1,
        transition: exiting ? "opacity 0.35s ease" : "none",
        animation: "overlay-in 0.35s ease both",
      }}
    >
      <div style={{ maxWidth: 540, width: "100%", textAlign: "center" }}>
        {/* ── Day pill ── */}
        <div
          style={{
            display: "inline-block",
            fontFamily: theme.mono,
            fontSize: 9,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: theme.subColor,
            border: `1px solid ${theme.cardBorder}`,
            padding: "4px 16px",
            marginBottom: 18,
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? "translateY(0)" : "translateY(-12px)",
            transition:
              "opacity 0.45s ease, transform 0.45s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          Day {dayNumber}
        </div>

        {/* ── Day title with ink-reveal effect ── */}
        <div
          style={{
            fontSize: 34,
            fontWeight: 900,
            lineHeight: 1.15,
            marginBottom: 18,
            letterSpacing: "-0.5px",
            overflow: "hidden",
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? "translateY(0)" : "translateY(20px)",
            transition:
              "opacity 0.5s ease 0.08s, transform 0.5s cubic-bezier(0.16,1,0.3,1) 0.08s",
          }}
        >
          {dayTitle}
        </div>

        {/* ── Atmosphere ── */}
        <p
          style={{
            fontSize: 14,
            fontStyle: "italic",
            color: theme.subColor,
            lineHeight: 1.75,
            marginBottom: 32,
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? "translateY(0)" : "translateY(14px)",
            transition:
              "opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {atmosphere}
        </p>

        {/* ── Factors ── */}
        {phase >= 3 && factors.length > 0 && (
          <div style={{ textAlign: "left", marginBottom: 24 }}>
            <div
              style={{
                fontFamily: theme.mono,
                fontSize: 8,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: theme.subColor,
                marginBottom: 14,
                textAlign: "center",
              }}
            >
              New pressures on the newsroom
            </div>

            {factors.map((f, i) => (
              <div
                key={f.factor_id}
                style={{
                  background: theme.cardBg,
                  border: `1px solid ${theme.cardBorder}`,
                  borderLeft: `3px solid ${pressureColor(f.pressure)}`,
                  padding: "12px 16px",
                  marginBottom: 10,
                  animation: `factor-slide 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 160}ms both`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 5,
                  }}
                >
                  <span
                    style={{
                      fontFamily: theme.mono,
                      fontSize: 8,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: pressureColor(f.pressure),
                    }}
                  >
                    {f.pressure}
                  </span>
                  <span
                    style={{
                      fontFamily: theme.mono,
                      fontSize: 8,
                      color: theme.subColor,
                    }}
                  >
                    · {f.type}
                  </span>
                  {f.caused_by_previous_choice && (
                    <span
                      style={{
                        fontFamily: theme.mono,
                        fontSize: 7,
                        color: theme.subColor,
                        marginLeft: "auto",
                        fontStyle: "italic",
                      }}
                    >
                      ↩ caused by your last edition
                    </span>
                  )}
                </div>
                {/* Character / Name */}
                {f.character && (
                  <div
                    style={{
                      fontFamily: theme.font,
                      fontWeight: 700,
                      fontSize: 12,
                      marginBottom: 3,
                      color: theme.textColor,
                    }}
                  >
                    {f.character}
                  </div>
                )}
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
                  {f.name}
                </div>
                {/* Quote (funny vignette) */}
                {f.quote && (
                  <div
                    style={{
                      fontFamily: theme.font,
                      fontSize: 11.5,
                      fontStyle: "italic",
                      color: theme.subColor,
                      lineHeight: 1.65,
                      borderLeft: `2px solid ${pressureColor(f.pressure)}44`,
                      paddingLeft: 10,
                      marginBottom: 6,
                    }}
                  >
                    "{f.quote}"
                  </div>
                )}
                <div
                  style={{
                    fontSize: 11,
                    color: theme.subColor,
                    lineHeight: 1.55,
                  }}
                >
                  {f.consequence_hint || f.description}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Skip / continue ── */}
        {phase >= 2 && (
          <button
            onClick={handleSkip}
            style={{
              marginTop: 8,
              background: "none",
              border: "none",
              fontFamily: theme.mono,
              fontSize: 9,
              color: theme.subColor,
              cursor: "pointer",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              opacity: 0.65,
              animation: "fadeIn 0.5s ease both",
              transition: "opacity 0.15s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateX(4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0.65";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            {phase >= 3 ? "Enter the Newsroom →" : "Skip →"}
          </button>
        )}
      </div>
    </div>
  );
}
