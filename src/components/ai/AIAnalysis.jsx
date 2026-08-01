import React from "react";
import { ShieldAlert, Cpu, HeartHandshake, Eye } from "lucide-react";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";

export function AIAnalysis({ analysis }) {
  if (!analysis) return null;

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <Card style={{ borderLeft: "4px solid var(--accent-purple)" }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", textAlign: "left" }}>
          <ShieldAlert size={28} style={{ color: "var(--accent-purple)", flexShrink: 0, marginTop: "0.2rem" }} />
          <div>
            <h3 style={{ color: "#fff", fontSize: "1.25rem", marginBottom: "0.5rem" }}>
              AI Natural Language Processing Analysis
            </h3>
            <p style={{ fontSize: "0.925rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
              {analysis.summary}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid-3">
        {/* Technology Classification */}
        <Card style={{ display: "flex", flexDirection: "column", gap: "1rem", textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Cpu size={20} style={{ color: "var(--accent-teal)" }} />
            <h4 style={{ color: "#fff", fontSize: "0.95rem" }}>Classification Domain</h4>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Assigned using semantic concept classification heuristics.
          </p>
          <div style={{ marginTop: "auto" }}>
            <Badge variant="teal">{analysis.domain}</Badge>
          </div>
        </Card>

        {/* Identified Components */}
        <Card style={{ display: "flex", flexDirection: "column", gap: "1rem", textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <HeartHandshake size={20} style={{ color: "var(--accent-purple)" }} />
            <h4 style={{ color: "#fff", fontSize: "0.95rem" }}>Extracted Components</h4>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
            {(analysis.components || []).map((comp, idx) => (
              <span 
                key={idx} 
                style={{ fontSize: "0.85rem", padding: "0.35rem 0.5rem", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", color: "var(--text-primary)" }}
              >
                {comp}
              </span>
            ))}
          </div>
        </Card>

        {/* Extracted Functions */}
        <Card style={{ display: "flex", flexDirection: "column", gap: "1rem", textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Eye size={20} style={{ color: "var(--accent-green)" }} />
            <h4 style={{ color: "#fff", fontSize: "0.95rem" }}>System Capabilities</h4>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
            {(analysis.functions || []).map((func, idx) => (
              <span 
                key={idx} 
                style={{ fontSize: "0.85rem", padding: "0.35rem 0.5rem", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", color: "var(--text-primary)" }}
              >
                {func}
              </span>
            ))}
          </div>
        </Card>
      </div>

    </div>
  );
}

export default AIAnalysis;
