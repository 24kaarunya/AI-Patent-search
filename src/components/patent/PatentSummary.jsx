import React from "react";
import { Badge } from "../common/Badge";
import { formatDate } from "../../utils/formatters";
import { FileText, Calendar, User, Hammer, Award, ExternalLink } from "lucide-react";

export function PatentSummary({ patent }) {
  if (!patent) return null;

  return (
    <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      
      {/* Header Info */}
      <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.5rem", alignItems: "center" }}>
          <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--accent-teal)", fontFamily: "var(--font-mono)" }}>
            {patent.patentNumber}
          </span>
          <Badge variant={patent.status === "Granted" ? "green" : "amber"}>
            {patent.status}
          </Badge>
          <Badge variant="purple">
            {patent.classification}
          </Badge>
        </div>
        <h2 style={{ fontSize: "1.5rem", color: "#fff", lineHeight: "1.3", margin: "0.5rem 0" }}>
          {patent.title}
        </h2>
      </div>

      {/* Grid Metadata */}
      <div className="grid-2" style={{ background: "rgba(255, 255, 255, 0.01)", border: "1px solid var(--border-color)", padding: "1.25rem", borderRadius: "var(--radius-md)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
            <Award size={16} style={{ color: "var(--accent-purple)" }} />
            <span style={{ fontWeight: 600 }}>Assignee:</span>
            <span style={{ color: "var(--text-secondary)" }}>{patent.assignee}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
            <User size={16} style={{ color: "var(--accent-purple)" }} />
            <span style={{ fontWeight: 600 }}>Inventors:</span>
            <span style={{ color: "var(--text-secondary)" }}>{(patent.inventors || []).join(", ")}</span>
          </div>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
            <Calendar size={16} style={{ color: "var(--accent-teal)" }} />
            <span style={{ fontWeight: 600 }}>Filing Date:</span>
            <span style={{ color: "var(--text-secondary)" }}>{formatDate(patent.filingDate)}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
            <Calendar size={16} style={{ color: "var(--accent-teal)" }} />
            <span style={{ fontWeight: 600 }}>Publication Date:</span>
            <span style={{ color: "var(--text-secondary)" }}>{formatDate(patent.publicationDate)}</span>
          </div>
        </div>
      </div>

      {/* Abstract */}
      <div>
        <h4 style={{ fontSize: "1rem", color: "#fff", marginBottom: "0.5rem", borderLeft: "3px solid var(--accent-purple)", paddingLeft: "0.5rem" }}>
          Abstract
        </h4>
        <p style={{ fontSize: "0.925rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
          {patent.abstract}
        </p>
      </div>

      {/* Description */}
      <div>
        <h4 style={{ fontSize: "1rem", color: "#fff", marginBottom: "0.5rem", borderLeft: "3px solid var(--accent-teal)", paddingLeft: "0.5rem" }}>
          Description
        </h4>
        <p style={{ fontSize: "0.925rem", color: "var(--text-secondary)", lineHeight: "1.6", whiteSpace: "pre-line" }}>
          {patent.description}
        </p>
      </div>

      {/* IPC Codes */}
      <div>
        <h4 style={{ fontSize: "1rem", color: "#fff", marginBottom: "0.5rem" }}>
          International Patent Classification (IPC)
        </h4>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {(patent.ipcCode || "").split(",").map((code, idx) => (
            <span 
              key={idx} 
              style={{ padding: "0.25rem 0.5rem", background: "var(--bg-tertiary)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", fontSize: "0.8rem", color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}
            >
              {code.trim()}
            </span>
          ))}
        </div>
      </div>

      {/* Claims */}
      <div>
        <h4 style={{ fontSize: "1rem", color: "#fff", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FileText size={18} style={{ color: "var(--accent-purple)" }} />
          Patent Claims
        </h4>
        <ol style={{ paddingLeft: "1.25rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem" }}>
          {(patent.claims || []).map((claim, idx) => (
            <li key={idx} style={{ lineHeight: "1.5" }}>
              {claim}
            </li>
          ))}
        </ol>
      </div>
      {/* Source URL & Disclaimer */}
      {patent.sourceUrl && (
        <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontStyle: "italic" }}>
            AI summary for research use only — not a legal opinion on patentability.
          </span>
          <a
            href={patent.sourceUrl}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: "0.82rem", color: "var(--accent-teal)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: 600 }}
          >
            <ExternalLink size={13} /> View Original Patent ({patent.source})
          </a>
        </div>
      )}

    </div>
  );
}

export default PatentSummary;
