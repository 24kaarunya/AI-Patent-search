import React from "react";

export function SimilarityScore({ score = 0, variant = "purple", size = 65 }) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius; // ~150.8
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = () => {
    switch (variant) {
      case "green": return "var(--accent-green)";
      case "amber": return "var(--accent-amber)";
      case "red": return "var(--accent-red)";
      default: return "var(--accent-purple)";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
      <div style={{ position: "relative", width: `${size}px`, height: `${size}px` }}>
        <svg viewBox="0 0 60 60" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
          {/* Background circle */}
          <circle
            cx="30"
            cy="30"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="5"
          />
          {/* Active progress */}
          <circle
            cx="30"
            cy="30"
            r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)" }}
          />
        </svg>
        {/* Score text overlay */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>
            {score}%
          </span>
        </div>
      </div>
      <span style={{ fontSize: "0.65rem", fontWeight: 700, color: getColor(), textTransform: "uppercase", letterSpacing: "0.05em" }}>
        Similarity
      </span>
    </div>
  );
}

export default SimilarityScore;
