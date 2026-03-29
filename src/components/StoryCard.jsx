import React, { useState } from "react";
import { useSettings } from "../context/SettingsContext.jsx";

const TAG_STYLES = {
  Investigative: { border: "#8b1a1a", label: "#8b1a1a" },
  Politics: { border: "#1a3a8b", label: "#1a3a8b" },
  Crime: { border: "#5a1a1a", label: "#5a1a1a" },
  Culture: { border: "#4a1a6a", label: "#4a1a6a" },
  Health: { border: "#1a5a2a", label: "#1a5a2a" },
  Business: { border: "#3a3a2a", label: "#3a3a2a" },
  Environment: { border: "#1a5a4a", label: "#1a5a4a" },
  Technology: { border: "#2a2a7a", label: "#2a2a7a" },
  Staff: { border: "#7a3a1a", label: "#7a3a1a" },
  default: { border: "#5a5040", label: "#5a5040" },
};

const EXPLOSIVE_DOTS = (n, theme) =>
  Array.from({ length: 5 }, (_, i) => (
    <span
      key={i}
      style={{
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: i < n ? "#8b1a1a" : theme.barBg,
        border: `1px solid ${i < n ? "#8b1a1a" : theme.cardBorder}`,
        marginRight: 2,
        transition: "background 0.2s",
      }}
    />
  ));

export default function StoryCard({
  story,
  onDragStart,
  dragging,
  compact,
  onReadMore,
  animDelay = 0,
}) {
  const { theme } = useSettings();
  const [hovered, setHovered] = useState(false);

  if (!story) return null;
  const ts = TAG_STYLES[story.tag] || TAG_STYLES.default;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, story)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="story-card-anim"
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.cardBorder}`,
        borderLeft: `3px solid ${hovered ? theme.textColor : ts.border}`,
        padding: compact ? "8px 10px" : "11px 13px",
        marginBottom: 8,
        cursor: "grab",
        opacity: dragging ? 0.3 : 1,
        transform: hovered ? "translateX(3px)" : "translateX(0)",
        transition:
          "border-left-color 0.18s, transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s, opacity 0.15s",
        userSelect: "none",
        boxShadow: hovered ? "2px 4px 14px rgba(0,0,0,0.13)" : "none",
        animationDelay: `${animDelay}ms`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 5,
        }}
      >
        <span
          style={{
            fontFamily: theme.mono,
            fontSize: 8,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: ts.label,
            border: `1px solid ${ts.border}22`,
            padding: "1px 5px",
          }}
        >
          {story.tag}
        </span>
        <div style={{ display: "flex", alignItems: "center" }}>
          {EXPLOSIVE_DOTS(story.explosive_rating, theme)}
        </div>
      </div>

      <p
        style={{
          margin: "0 0 4px",
          fontFamily: theme.font,
          fontWeight: 700,
          fontSize: compact ? 11 : 12.5,
          color: theme.textColor,
          lineHeight: 1.3,
        }}
      >
        {story.headline && story.headline.length > 80
          ? story.headline.slice(0, 80) + "…"
          : story.headline}
      </p>

      {!compact && (
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onReadMore?.(story);
          }}
          style={{
            marginTop: 3,
            background: "none",
            border: "none",
            fontSize: 9,
            color: "#94a3b8",
            cursor: "pointer",
            padding: 0,
            letterSpacing: "0.06em",
            textDecoration: "underline",
            textTransform: "uppercase",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = theme.textColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#94a3b8";
          }}
        >
          Read article
        </button>
      )}

      {!compact && (
        <p
          style={{
            margin: 0,
            fontFamily: theme.mono,
            fontSize: 9,
            color: theme.subColor,
            fontStyle: "italic",
            lineHeight: 1.4,
            letterSpacing: "0.02em",
          }}
        >
          {story.emotional_register}
        </p>
      )}
    </div>
  );
}
