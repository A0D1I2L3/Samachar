import React, { useState, useEffect } from "react";

const LINES = [
  "The paper goes to print…",
  "The presses are running…",
  "The city wakes up to your edition…",
  "Phone lines lighting up across Halcyon…",
  "The story is doing what stories do…",
];

export default function LoadingScreen({ error, onRetry }) {
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    if (error) return;
    const t = setInterval(() => setLineIdx((i) => (i + 1) % LINES.length), 1800);
    return () => clearInterval(t);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Georgia', serif",
        color: "#e2e8f0",
        gap: 24,
      }}
    >
      {error ? (
        <div style={{ textAlign: "center", maxWidth: 480 }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>⚠</div>
          <div style={{ fontSize: 14, color: "#ef4444", marginBottom: 16, lineHeight: 1.6, fontFamily: "monospace" }}>
            {error}
          </div>
          {error.includes("NO_API_KEY") && (
            <div
              style={{
                background: "#1e293b", borderRadius: 8, padding: "14px 18px",
                fontSize: 12, color: "#94a3b8", marginBottom: 20, textAlign: "left", lineHeight: 1.7,
              }}
            >
              <strong style={{ color: "#e2e8f0" }}>To add your Grok API key:</strong><br />
              1. Create a file called <code style={{ color: "#86efac" }}>.env</code> in the project root<br />
              2. Add: <code style={{ color: "#86efac" }}>VITE_GROK_API_KEY=xai-your-key-here</code><br />
              3. Restart the dev server (<code>npm run dev</code>)
            </div>
          )}
          <button
            onClick={onRetry}
            style={{
              background: "#1e293b", color: "#fff", border: "1px solid #334155",
              borderRadius: 8, padding: "12px 28px", fontSize: 13, fontWeight: 700,
              cursor: "pointer", letterSpacing: "0.06em",
            }}
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div
            style={{
              width: 48, height: 48,
              border: "3px solid #1e293b",
              borderTop: "3px solid #86efac",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <div style={{ fontSize: 14, color: "#64748b", fontStyle: "italic", letterSpacing: "0.04em" }}>
            {LINES[lineIdx]}
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </>
      )}
    </div>
  );
}
