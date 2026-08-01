import React from "react";
import { Check, X, ArrowRightLeft, Sparkles, AlertTriangle, Table } from "lucide-react";
import { Card } from "../common/Card";

export function PatentComparison({ invention, patent }) {
  if (!invention || !patent) {
    return <p style={{ color: "var(--text-muted)" }}>Select a patent to compare side-by-side.</p>;
  }

  const patentCompSet = new Set((patent.components || []).map(c => c.toLowerCase()));
  const patentFuncSet = new Set((patent.functions || []).map(f => f.toLowerCase()));

  // Aggregate unique features for Module 11 comparison table
  const allFeatures = Array.from(new Set([
    ...(invention.components || []),
    ...(invention.functions || []),
    ...(patent.components || []),
    ...(patent.functions || [])
  ]));

  return (
    <div className="fade-in">
      <Card style={{ padding: "2rem" }}>
        
        {/* Header comparison summary */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "1.5rem", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h3 style={{ fontSize: "1.3rem", color: "#fff", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ArrowRightLeft size={20} style={{ color: "var(--accent-purple)" }} />
              Claim Comparison Matrix
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Side-by-side analysis of hardware components and functional capabilities.
            </p>
          </div>
          
          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{ padding: "0.5rem 1rem", background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "var(--radius-md)", fontSize: "0.85rem", color: "#fca5a5", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <AlertTriangle size={14} /> Overlap: Red
            </div>
            <div style={{ padding: "0.5rem 1rem", background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "var(--radius-md)", fontSize: "0.85rem", color: "#34d399", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Sparkles size={14} /> Distinctive: Green
            </div>
          </div>
        </div>

        {/* MODULE 11: Feature Comparison Table */}
        <div style={{ marginBottom: "2rem" }}>
          <h4 style={{ fontSize: "1rem", color: "#fff", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Table size={16} style={{ color: "var(--accent-teal)" }} />
            Feature Comparison Matrix Table
          </h4>

          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Feature / Capability</th>
                  <th style={{ textStyle: "center", width: "140px" }}>Your Idea</th>
                  <th style={{ textStyle: "center", width: "220px" }}>{patent.patentNumber} ({patent.assignee})</th>
                  <th>Claim Analysis</th>
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((feat, idx) => {
                  const inInvention = (invention.components || []).some(c => c.toLowerCase() === feat.toLowerCase()) || 
                                     (invention.functions || []).some(f => f.toLowerCase() === feat.toLowerCase());
                  const inPatent = patentCompSet.has(feat.toLowerCase()) || patentFuncSet.has(feat.toLowerCase());

                  let statusText = "Identical Prior Art Claim";
                  let statusColor = "var(--accent-red)";
                  if (inInvention && !inPatent) {
                    statusText = "★ Potentially Distinctive Feature";
                    statusColor = "var(--accent-green)";
                  } else if (!inInvention && inPatent) {
                    statusText = "Existing Patent Feature";
                    statusColor = "var(--text-muted)";
                  }

                  return (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600, color: "#fff" }}>{feat}</td>
                      <td style={{ textAlign: "center", fontSize: "1.1rem" }}>
                        {inInvention ? <span style={{ color: "var(--accent-green)" }}>✓</span> : <span style={{ color: "var(--text-muted)" }}>✗</span>}
                      </td>
                      <td style={{ textAlign: "center", fontSize: "1.1rem" }}>
                        {inPatent ? <span style={{ color: "var(--accent-red)" }}>✓</span> : <span style={{ color: "var(--text-muted)" }}>✗</span>}
                      </td>
                      <td style={{ fontSize: "0.85rem", color: statusColor, fontWeight: 600 }}>
                        {statusText}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Outer Grid for Detailed Component Lists */}
        <div className="comparison-grid">
          
          {/* Invention Column */}
          <div className="comparison-column">
            <h4 className="comparison-heading" style={{ color: "var(--accent-purple)" }}>
              Your Invention: {invention.title}
            </h4>

            <div>
              <h5 style={{ fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: "0.5rem", fontWeight: 700 }}>
                Proposed Hardware & Components
              </h5>
              <div className="comparison-feature-list">
                {(invention.components || []).map((comp, idx) => {
                  const isMatched = patentCompSet.has(comp.toLowerCase());
                  return (
                    <div 
                      key={idx} 
                      className={`comparison-item ${isMatched ? "matched" : "novel"}`}
                    >
                      <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{comp}</span>
                      {isMatched ? (
                        <span style={{ color: "var(--accent-red)", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          <X size={12} /> Pre-claimed feature
                        </span>
                      ) : (
                        <span style={{ color: "var(--accent-green)", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          <Check size={12} /> ★ Distinctive component
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <h5 style={{ fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: "0.5rem", fontWeight: 700 }}>
                Proposed System Functions
              </h5>
              <div className="comparison-feature-list">
                {(invention.functions || []).map((func, idx) => {
                  const isMatched = patentFuncSet.has(func.toLowerCase());
                  return (
                    <div 
                      key={idx} 
                      className={`comparison-item ${isMatched ? "matched" : "novel"}`}
                    >
                      <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{func}</span>
                      {isMatched ? (
                        <span style={{ color: "var(--accent-red)", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          <X size={12} /> Pre-claimed function
                        </span>
                      ) : (
                        <span style={{ color: "var(--accent-green)", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          <Check size={12} /> ★ Distinctive capability
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Patent Column */}
          <div className="comparison-column">
            <h4 className="comparison-heading" style={{ color: "var(--accent-teal)" }}>
              Prior Art: {patent.title} ({patent.patentNumber})
            </h4>

            <div>
              <h5 style={{ fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: "0.5rem", fontWeight: 700 }}>
                Existing Patented Components
              </h5>
              <div className="comparison-feature-list">
                {(patent.components || []).map((comp, idx) => {
                  return (
                    <div 
                      key={idx} 
                      className="comparison-item"
                      style={{ background: "rgba(255,255,255,0.01)" }}
                    >
                      <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{comp}</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Patented Feature</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <h5 style={{ fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: "0.5rem", fontWeight: 700 }}>
                Existing Patented Functions
              </h5>
              <div className="comparison-feature-list">
                {(patent.functions || []).map((func, idx) => {
                  return (
                    <div 
                      key={idx} 
                      className="comparison-item"
                      style={{ background: "rgba(255,255,255,0.01)" }}
                    >
                      <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{func}</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Patented capability</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

      </Card>
    </div>
  );
}

export default PatentComparison;
