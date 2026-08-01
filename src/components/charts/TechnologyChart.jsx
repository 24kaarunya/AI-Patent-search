import React from "react";

export function TechnologyChart() {
  // Mock data of technology share
  const segments = [
    { label: "Hardware Sensors", value: 40, color: "var(--accent-teal)" },
    { label: "AI Models", value: 30, color: "var(--accent-purple)" },
    { label: "Cloud Storage", value: 18, color: "var(--accent-green)" },
    { label: "Communication BLE", value: 12, color: "var(--accent-amber)" }
  ];

  // Circumference calculation for radius = 40
  // C = 2 * PI * r = 2 * 3.14159 * 40 = 251.3
  const r = 40;
  const c = 251.3;
  
  let accumulatedPercent = 0;

  return (
    <div style={{ padding: "0.5rem 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h4 style={{ marginBottom: "1rem", fontSize: "0.95rem", color: "var(--text-secondary)" }}>
        Patent Technology Components Breakdown
      </h4>
      
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "2rem", width: "100%", flexWrap: "wrap" }}>
        {/* Donut SVG */}
        <div style={{ position: "relative", width: "120px", height: "120px" }}>
          <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
            {/* Background circle */}
            <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="12" />
            
            {segments.map((seg, idx) => {
              const dashArray = `${(seg.value / 100) * c} ${c}`;
              const dashOffset = -((accumulatedPercent / 100) * c);
              accumulatedPercent += seg.value;

              return (
                <circle
                  key={idx}
                  cx="50"
                  cy="50"
                  r={r}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="12"
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  style={{ transition: "stroke-dashoffset 0.5s ease" }}
                />
              );
            })}
          </svg>
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column"
          }}>
            <span style={{ fontSize: "1.1rem", fontWeight: 800 }}>10</span>
            <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Patents</span>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", textAlign: "left" }}>
          {segments.map((seg, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", backgroundColor: seg.color }}></span>
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-primary)" }}>{seg.value}%</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{seg.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TechnologyChart;
