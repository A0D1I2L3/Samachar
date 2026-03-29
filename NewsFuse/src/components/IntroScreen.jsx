import React, { useState, useEffect } from "react";
import { useSettings } from "../context/SettingsContext.jsx";

const HOW_TO_PLAY = [
  {
    icon: "📰",
    title: "Read the Desk",
    body: "Five stories arrive each morning. Pick four for the front page — one might be a planted distraction.",
  },
  {
    icon: "⟺",
    title: "Build the Front Page",
    body: "Drag stories onto the grid. Resize to fill every column inch. No white space allowed.",
  },
  {
    icon: "⚖",
    title: "Every Slot Is a Decision",
    body: "The lead story hits hardest. Bury truth and lose your team. Lead with a planted story and lose your soul.",
  },
  {
    icon: "◈",
    title: "Survive the Pressure",
    body: "Advertisers, politicians, and reporters will push back. Respond or ignore — both have consequences.",
  },
];

export default function IntroScreen({ onStart }) {
  const { theme, settings } = useSettings();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

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
        justifyContent: "center",
        padding: "40px 20px 60px",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.45s ease",
      }}
    >
      <div style={{ maxWidth: 640, width: "100%" }}>

        {/* MASTHEAD */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              fontFamily: theme.mono,
              fontSize: 12,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: theme.subColor,
              marginBottom: 14,
            }}
          >
            Bharatpur, India · A Newspaper Simulation
          </div>
          <div
            style={{
              display: "inline-block",
              borderTop: `3px solid ${theme.textColor}`,
              borderBottom: `3px solid ${theme.textColor}`,
              padding: "16px 48px",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontFamily: theme.font,
                fontSize: "clamp(36px, 7vw, 62px)",
                fontWeight: 900,
                letterSpacing: "-1.5px",
                color: theme.textColor,
                lineHeight: 1,
              }}
            >
              {settings.paperName}
            </div>
          </div>
          <div
            style={{
              fontFamily: theme.font,
              fontSize: 16,
              fontStyle: "italic",
              color: theme.subColor,
              lineHeight: 1.6,
            }}
          >
            You are{" "}
            <strong style={{ color: theme.textColor }}>
              {settings.editorName || "Arjun Mehta"}
            </strong>
            . Editor. Bharatpur's last independent newspaper is yours to run — or ruin.
          </div>
        </div>

        {/* HOW TO PLAY */}
        <div style={{ marginBottom: 36 }}>
          <div
            style={{
              fontFamily: theme.mono,
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: theme.subColor,
              marginBottom: 14,
              borderBottom: `1px solid ${theme.cardBorder}`,
              paddingBottom: 8,
            }}
          >
            How to Play
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 10,
            }}
          >
            {HOW_TO_PLAY.map((item, i) => (
              <div
                key={i}
                style={{
                  background: theme.cardBg,
                  border: `1px solid ${theme.cardBorder}`,
                  borderRadius: 4,
                  padding: "14px 16px",
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                }}
              >
                <div style={{ fontSize: 22, flexShrink: 0, lineHeight: 1 }}>
                  {item.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: theme.mono,
                      fontSize: 12,
                      fontWeight: 700,
                      color: theme.textColor,
                      letterSpacing: "0.06em",
                      marginBottom: 5,
                      textTransform: "uppercase",
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontFamily: theme.font,
                      fontSize: 13,
                      color: theme.subColor,
                      lineHeight: 1.6,
                    }}
                  >
                    {item.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PARAMETERS HINT */}
        <div
          style={{
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            borderLeft: `4px solid ${theme.accentGold}`,
            padding: "14px 20px",
            marginBottom: 36,
            fontFamily: theme.font,
            fontSize: 14,
            color: theme.subColor,
            lineHeight: 1.7,
            fontStyle: "italic",
          }}
        >
          Balance{" "}
          <strong style={{ color: theme.textColor }}>five pressures</strong>:
          Integrity, Reputation, Revenue, Morale, and Political standing. Let
          any one collapse and the paper dies.
        </div>

        {/* START BUTTON */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={onStart}
            style={{
              background: theme.darkMode ? "#e8e4db" : "#1a1a1a",
              color: theme.darkMode ? "#1a1a1a" : "#f5f1e8",
              border: "none",
              padding: "18px 60px",
              fontFamily: theme.mono,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              cursor: "pointer",
              borderRadius: 2,
              transition:
                "opacity 0.15s, transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.88";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.28)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            ◆ Open the Newsroom — Day 1
          </button>
          <div
            style={{
              fontFamily: theme.mono,
              fontSize: 11,
              color: theme.subColor,
              letterSpacing: "0.12em",
              marginTop: 12,
              textTransform: "uppercase",
            }}
          >
            {settings.paperName} · Editor:{" "}
            {settings.editorName || "Arjun Mehta"}
          </div>
        </div>
      </div>
    </div>
  );
}
