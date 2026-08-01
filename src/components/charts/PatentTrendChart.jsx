import React from "react";

export function PatentTrendChart() {
  // Mock research data: Patent domain match counts
  const data = [
    { label: "IoT + AI", value: 45 },
    { label: "Robotics + AI", value: 35 },
    { label: "Health IoT", value: 28 },
    { label: "Blockchain", value: 22 },
    { label: "Renewables", value: 18 }
  ];

  const maxValue = 50;
  const chartHeight = 160;
  const chartWidth = 350;
  const barWidth = 35;
  const gap = 25;

  return (
    <div style={{ padding: "1rem 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h4 style={{ marginBottom: "1rem", fontSize: "0.95rem", color: "var(--text-secondary)" }}>
        Domain Match Frequency (Queries)
      </h4>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: "100%", maxHeight: "180px" }}>
        {/* Y Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = 20 + ratio * 100;
          return (
            <g key={i}>
              <line x1="30" y1={y} x2="330" y2={y} stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4 4" />
              <text x="5" y={y + 4} fill="var(--text-muted)" fontSize="9" fontWeight="600">
                {Math.round(maxValue * (1 - ratio))}
              </text>
            </g>
          );
        })}

        {/* Render Bars */}
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * 100;
          const x = 45 + index * (barWidth + gap);
          const y = 120 - barHeight;

          return (
            <g key={index} className="svg-group">
              {/* Gradient Definition */}
              <defs>
                <linearGradient id={`barGrad-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent-purple)" />
                  <stop offset="100%" stopColor="var(--accent-teal)" />
                </linearGradient>
              </defs>

              {/* Bar Rect */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={`url(#barGrad-${index})`}
                rx="4"
                className="svg-bar"
                style={{ transition: "all 0.3s ease" }}
              />

              {/* Top Score text */}
              <text x={x + barWidth / 2} y={y - 6} fill="var(--text-primary)" fontSize="9" fontWeight="700" textAnchor="middle">
                {item.value}
              </text>

              {/* Bottom Label */}
              <text x={x + barWidth / 2} y="138" fill="var(--text-secondary)" fontSize="9" fontWeight="600" textAnchor="middle">
                {item.label}
              </text>
            </g>
          );
        })}
        {/* Baseline */}
        <line x1="30" y1="120" x2="330" y2="120" stroke="var(--border-color)" strokeWidth="2" />
      </svg>
    </div>
  );
}

export default PatentTrendChart;
