import React from "react";

const TAG_COLORS = {
  Investigative: { bg: "#fef2f2", color: "#991b1b" },
  Politics:      { bg: "#dbeafe", color: "#1e40af" },
  Crime:         { bg: "#fef2f2", color: "#7f1d1d" },
  Culture:       { bg: "#fdf4ff", color: "#7e22ce" },
  Health:        { bg: "#f0fdf4", color: "#166534" },
  Business:      { bg: "#f8fafc", color: "#334155" },
  Environment:   { bg: "#ccfbf1", color: "#0f766e" },
  Technology:    { bg: "#ede9fe", color: "#6d28d9" },
  Staff:         { bg: "#fff7ed", color: "#c2410c" },
  default:       { bg: "#f1f5f9", color: "#475569" },
};

const EXPLOSIVE_DOTS = (n) =>
  Array.from({ length: 5 }, (_, i) => (
    <span
      key={i}
      style={{
        display: "inline-block",
        width: 7, height: 7,
        borderRadius: "50%",
        background: i < n ? "#ef4444" : "#e2e8f0",
        marginRight: 2,
      }}
    />
  ));

export default function StoryCard({ story, onDragStart, dragging, compact }) {
  if (!story) return null;
  const tagStyle = TAG_COLORS[story.tag] || TAG_COLORS.default;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, story)}
      style={{
        background: "#fff",
        border: "1.5px solid #e2e8f0",
        borderLeft: `4px solid ${tagStyle.color}`,
        borderRadius: 8,
        padding: compact ? "8px 10px" : "11px 13px",
        marginBottom: 8,
        cursor: "grab",
        opacity: dragging ? 0.35 : 1,
        transition: "box-shadow 0.15s, transform 0.15s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        userSelect: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.13)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Tag + explosive rating */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
        <span
          style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.07em",
            textTransform: "uppercase", padding: "2px 6px", borderRadius: 3,
            background: tagStyle.bg, color: tagStyle.color,
          }}
        >
          {story.tag}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {EXPLOSIVE_DOTS(story.explosive_rating)}
        </div>
      </div>

      {/* Headline */}
      <p
        style={{
          margin: "0 0 4px", fontWeight: 800, fontSize: compact ? 11 : 12.5,
          color: "#0f172a", lineHeight: 1.25, fontFamily: "'Georgia', serif",
        }}
      >
        {story.headline && story.headline.length > 80 ? story.headline.slice(0, 80) + "…" : story.headline}
      </p>

      {/* Emotional register */}
      {!compact && (
        <p style={{ margin: 0, fontSize: 10, color: "#94a3b8", fontStyle: "italic", lineHeight: 1.4 }}>
          {story.emotional_register}
        </p>
      )}
    </div>
  );
}
