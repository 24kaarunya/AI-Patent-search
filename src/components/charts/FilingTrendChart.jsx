import React from "react";

export function FilingTrendChart() {
  const points = [
    { year: "2019", x: 40, y: 95, value: 12 },
    { year: "2020", x: 80, y: 88, value: 16 },
    { year: "2021", x: 120, y: 72, value: 24 },
    { year: "2022", x: 160, y: 60, value: 30 },
    { year: "2023", x: 200, y: 44, value: 38 },
    { year: "2024", x: 240, y: 32, value: 45 },
    { year: "2025", x: 280, y: 20, value: 52 },
    { year: "2026", x: 320, y: 12, value: 58 }
  ];

  // Build points path for SVG polyline/path
  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(" ");
  // Path closed for area fill gradient
  const areaPath = `M ${points[0].x},110 L ${polylinePoints} L ${points[points.length - 1].x},110 Z`;

  return (
    <div style={{ padding: "1rem 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h4 style={{ marginBottom: "1rem", fontSize: "0.95rem", color: "var(--text-secondary)" }}>
        Global Annual Patent Filing Volume (Trend)
      </h4>
      <svg viewBox="0 0 350 140" style={{ width: "100%", maxHeight: "160px" }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-teal)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--accent-teal)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[20, 50, 80, 110].map((y, idx) => (
          <line key={idx} x1="30" y1={y} x2="330" y2={y} stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3 3" />
        ))}

        {/* Gradient area */}
        <path d={areaPath} fill="url(#areaGrad)" />

        {/* Smooth Trend Line */}
        <polyline
          fill="none"
          stroke="var(--accent-teal)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={polylinePoints}
        />

        {/* Points & Values */}
        {points.map((p, idx) => (
          <g key={idx}>
            <circle
              cx={p.x}
              cy={p.y}
              r="4"
              fill="var(--bg-primary)"
              stroke="var(--accent-teal)"
              strokeWidth="2.5"
            />
            {/* Value above point */}
            <text x={p.x} y={p.y - 8} fill="var(--text-primary)" fontSize="8" fontWeight="700" textAnchor="middle">
              {p.value}k
            </text>
            {/* Year below chart */}
            <text x={p.x} y="125" fill="var(--text-secondary)" fontSize="8" fontWeight="600" textAnchor="middle">
              {p.year}
            </text>
          </g>
        ))}

        {/* Baselines */}
        <line x1="30" y1="110" x2="330" y2="110" stroke="var(--border-color)" strokeWidth="1" />
      </svg>
    </div>
  );
}

export default FilingTrendChart;
