import React from "react";
import { CheckCircle, AlertTriangle, HelpCircle, ShieldCheck, Star, Info } from "lucide-react";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";

export function NoveltyAnalysis({ novelty }) {
  if (!novelty) return null;

  const getNoveltyColor = (level) => {
    if (level === "High") return "var(--accent-green)";
    if (level === "Medium") return "var(--accent-amber)";
    return "var(--accent-red)";
  };

  const getNoveltyIcon = (level) => {
    if (level === "High") return <ShieldCheck size={28} style={{ color: "var(--accent-green)" }} />;
    if (level === "Medium") return <HelpCircle size={28} style={{ color: "var(--accent-amber)" }} />;
    return <AlertTriangle size={28} style={{ color: "var(--accent-red)" }} />;
  };

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      
      {/* Novelty Summary Card */}
      <Card style={{ borderLeft: `4px solid ${getNoveltyColor(novelty.noveltyLevel)}` }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", textAlign: "left" }}>
          {getNoveltyIcon(novelty.noveltyLevel)}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <h3 style={{ color: "#fff", fontSize: "1.25rem" }}>
                AI-Assisted Novelty & Difference Analysis
              </h3>
              <Badge variant={novelty.noveltyLevel === "High" ? "green" : novelty.noveltyLevel === "Medium" ? "amber" : "red"}>
                {novelty.noveltyLevel} Novelty Profile
              </Badge>
            </div>
            
            <p style={{ fontSize: "0.925rem", color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "1rem" }}>
              {novelty.reasoning}
            </p>

            {/* Score Bar */}
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                <span style={{ color: "var(--text-secondary)" }}>Calculated Novelty Index:</span>
                <span style={{ color: getNoveltyColor(novelty.noveltyLevel) }}>{novelty.noveltyScore}%</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "100px", overflow: "hidden" }}>
                <div style={{ 
                  width: `${novelty.noveltyScore}%`, 
                  height: "100%", 
                  background: getNoveltyColor(novelty.noveltyLevel), 
                  transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)" 
                }}></div>
              </div>
            </div>

            {/* MODULE 12 LEGAL DISCLAIMER */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 0.85rem", background: "rgba(245, 158, 11, 0.05)", border: "1px solid rgba(245, 158, 11, 0.2)", borderRadius: "var(--radius-md)", fontSize: "0.775rem", color: "#fdba74" }}>
              <Info size={14} style={{ flexShrink: 0 }} />
              <span>
                <strong>Legal Disclaimer:</strong> This is an AI-assisted novelty analysis based on available database prior-art, not a formal legal determination of novelty or patentability.
              </span>
            </div>

          </div>
        </div>
      </Card>

      {/* Overlapping vs Distinctive Feature columns */}
      <div className="grid-2">
        {/* Distinctive features with ★ star icons */}
        <Card style={{ textAlign: "left" }}>
          <h4 style={{ color: "#fff", fontSize: "1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
            <Star size={18} style={{ color: "var(--accent-green)" }} />
            ★ Potentially Distinctive Features
          </h4>
          {novelty.distinctiveFeatures.length === 0 ? (
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              No distinctive features detected. Your system completely overlaps with top patents.
            </p>
          ) : (
            <ul style={{ paddingLeft: "1.25rem", color: "var(--text-secondary)", fontSize: "0.9rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {novelty.distinctiveFeatures.map((feat, idx) => (
                <li key={idx} style={{ listStyleType: "none", position: "relative", paddingLeft: "1rem" }}>
                  <span style={{ position: "absolute", left: "-0.5rem", color: "var(--accent-green)", fontWeight: 800 }}>★</span>
                  <strong style={{ color: "var(--text-primary)" }}>{feat}</strong>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: "0.5rem" }}>
                    — Not strongly matched in retrieved patent claims.
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Common features with ✓ checkmark icons */}
        <Card style={{ textAlign: "left" }}>
          <h4 style={{ color: "#fff", fontSize: "1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
            <CheckCircle size={18} style={{ color: "var(--accent-red)" }} />
            ✓ Common Features (Prior Art Conflict)
          </h4>
          {novelty.overlappingFeatures.length === 0 ? (
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              No overlapping features. Your invention shows perfect claim isolation.
            </p>
          ) : (
            <ul style={{ paddingLeft: "1.25rem", color: "var(--text-secondary)", fontSize: "0.9rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {novelty.overlappingFeatures.map((feat, idx) => (
                <li key={idx} style={{ listStyleType: "none", position: "relative", paddingLeft: "1rem" }}>
                  <span style={{ position: "absolute", left: "-0.5rem", color: "var(--accent-red)", fontWeight: 800 }}>✓</span>
                  <strong style={{ color: "var(--text-primary)" }}>{feat}</strong>
                  <span style={{ fontSize: "0.8rem", color: "var(--accent-red)", marginLeft: "0.5rem" }}>
                    — Pre-claimed in existing patent documents.
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

    </div>
  );
}

export default NoveltyAnalysis;
