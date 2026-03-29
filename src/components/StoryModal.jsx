import React, { useEffect } from "react";
import { useSettings } from "../context/SettingsContext.jsx";

export default function StoryModal({ story, onClose }) {
  const { theme } = useSettings();

  if (!story) return null;

  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  const DESK_ACCENTS = {
    Investigative: "#991b1b",
    Politics:      "#1e40af",
    Crime:         "#7f1d1d",
    Culture:       "#7e22ce",
    Health:        "#166534",
    Business:      "#1e3a5f",
    Environment:   "#0f766e",
    Technology:    "#6d28d9",
    Staff:         "#c2410c",
    Feature:       "#92400e",
    National:      "#1d4ed8",
    City:          "#065f46",
    default:       "#475569",
  };

  const tagDesk = story.desk || story.tag || "default";
  const accentColor = DESK_ACCENTS[tagDesk] || DESK_ACCENTS.default;
  const tagBg = theme.darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
  const explosiveRating = story.explosive_rating || 0;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: theme.darkMode ? "rgba(0,0,0,0.72)" : "rgba(0,0,0,0.48)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20, animation: "fadeIn 0.18s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
          borderTop: `4px solid ${accentColor}`,
          borderRadius: 4, maxWidth: 560, width: "100%",
          maxHeight: "82vh", overflowY: "auto",
          padding: "28px 28px 24px",
          boxShadow: theme.darkMode
            ? "0 24px 60px rgba(0,0,0,0.7)"
            : "0 24px 60px rgba(0,0,0,0.22)",
          animation: "slideUp 0.22s ease",
          position: "relative", fontFamily: theme.font, color: theme.textColor,
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 14, right: 14,
            background: theme.barBg, border: `1px solid ${theme.cardBorder}`,
            borderRadius: "50%", width: 28, height: 28, cursor: "pointer",
            fontSize: 13, color: theme.subColor,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = theme.textColor;
            e.currentTarget.style.color = theme.bgColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = theme.barBg;
            e.currentTarget.style.color = theme.subColor;
          }}
        >✕</button>

        {/* Desk tag + register + explosive rating */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", padding: "3px 9px", borderRadius: 2,
            background: tagBg, color: accentColor,
            border: `1px solid ${accentColor}30`, fontFamily: theme.mono,
          }}>{tagDesk}</span>

          {story.emotional_register && (
            <span style={{ fontSize: 10, color: theme.subColor, fontStyle: "italic", fontFamily: theme.font }}>
              {story.emotional_register}
            </span>
          )}

          <span style={{ marginLeft: "auto", fontSize: 11, letterSpacing: "2px", color: accentColor, fontFamily: theme.mono }}>
            {"●".repeat(explosiveRating)}
            <span style={{ color: theme.cardBorder }}>{"●".repeat(5 - explosiveRating)}</span>
          </span>
        </div>

        {/* Distraction warning */}
        {story.is_distraction && (
          <div style={{
            background: theme.darkMode ? "rgba(180,30,30,0.15)" : "#fff5f5",
            border: "1px solid #f87171", borderLeft: "4px solid #ef4444",
            borderRadius: 2, padding: "8px 12px", marginBottom: 14,
            fontFamily: theme.mono, fontSize: 10, color: "#b91c1c",
            letterSpacing: "0.08em", textTransform: "uppercase",
          }}>
            ⚠ Planted distraction — verify before placing
          </div>
        )}

        {/* Headline */}
        <h2 style={{
          fontFamily: theme.font, fontSize: "clamp(18px, 4vw, 26px)",
          fontWeight: 900, color: theme.textColor, lineHeight: 1.22,
          margin: "0 0 10px", letterSpacing: "-0.3px",
        }}>{story.headline}</h2>

        {/* Deck */}
        {story.deck && (
          <p style={{
            fontSize: 13, color: theme.subColor, fontStyle: "italic",
            lineHeight: 1.6, margin: "0 0 16px", paddingBottom: 16,
            borderBottom: `1px solid ${theme.cardBorder}`, fontFamily: theme.font,
          }}>{story.deck}</p>
        )}

        {/* Body */}
        <p style={{
          fontSize: 14, color: theme.textColor, lineHeight: 1.82,
          margin: 0, fontFamily: theme.font,
        }}>{story.body || story.summary}</p>

        {/* Distraction tell */}
        {story.distraction_tell && (
          <div style={{
            marginTop: 18, padding: "10px 14px",
            background: theme.darkMode ? "rgba(200,169,110,0.08)" : "#fffbf0",
            border: `1px solid ${theme.accentGold}55`,
            borderLeft: `3px solid ${theme.accentGold}`,
            borderRadius: 2, fontFamily: theme.mono, fontSize: 11,
            color: theme.subColor, fontStyle: "italic", lineHeight: 1.55,
          }}>
            ◆ Editor's note: {story.distraction_tell}
          </div>
        )}

        {/* Story review */}
        {story.story_review && (
          <div style={{
            marginTop: 14, padding: "10px 14px", background: theme.inputBg,
            border: `1px solid ${theme.cardBorder}`, borderRadius: 2,
            fontFamily: theme.font, fontSize: 12, color: theme.subColor,
            fontStyle: "italic", lineHeight: 1.6,
          }}>{story.story_review}</div>
        )}

        {/* Drag hint */}
        <div style={{
          marginTop: 20, padding: "10px 14px", background: theme.barBg,
          border: `1px solid ${theme.cardBorder}`, borderRadius: 2,
          fontFamily: theme.mono, fontSize: 10, color: theme.subColor,
          textAlign: "center", letterSpacing: "0.08em", textTransform: "uppercase",
        }}>
          Close and drag this card to place it on the front page
        </div>
      </div>
    </div>
  );
}
