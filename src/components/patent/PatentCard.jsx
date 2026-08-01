import React from "react";
import { Link } from "react-router-dom";
import { Bookmark, Calendar, User, FileText, ArrowRight, Check, ExternalLink, ShieldAlert } from "lucide-react";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import { SimilarityScore } from "./SimilarityScore";
import { formatDate } from "../../utils/formatters";

export function PatentCard({ patent, isSaved, onToggleSave = () => {}, onViewDetails = () => {}, onCompare = () => {} }) {
  const getScoreVariant = (score) => {
    if (score >= 70) return "red";
    if (score >= 40) return "amber";
    return "green";
  };

  return (
    <Card className="fade-in" style={{ marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1.5rem", flexWrap: "wrap" }}>
        
        {/* Left Side: Detail metadata */}
        <div style={{ flex: 1, minWidth: "280px", textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
            <Link
              to={`/patents/details?id=${patent.id}`}
              style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--accent-teal)", fontFamily: "var(--font-mono)", textDecoration: "none" }}
              title="View full patent details"
            >
              {patent.patentNumber}
            </Link>
            <Badge variant={patent.status === "Granted" ? "green" : "amber"}>
              {patent.status}
            </Badge>
            <Badge variant="purple">
              {patent.classification}
            </Badge>
            {patent.sourceUrl ? (
              <a
                href={patent.sourceUrl}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.2rem", textDecoration: "none" }}
                title="Open on Google Patents"
              >
                <ExternalLink size={10} /> {patent.source || "USPTO"}
              </a>
            ) : (
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                <ExternalLink size={10} /> Source: {patent.source || "USPTO"}
              </span>
            )}
          </div>

          <h3 style={{ fontSize: "1.2rem", marginBottom: "0.75rem", color: "#fff", lineHeight: "1.3" }}>
            {patent.title}
          </h3>

          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1rem", lineClamp: 3, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {patent.abstract}
          </p>

          {/* MODULE 9: Matched Features Checklist */}
          {patent.similarity && (patent.components || patent.functions) && (
            <div style={{ marginBottom: "1rem", display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)" }}>Matched Features:</span>
              {patent.components.slice(0, 3).map((comp, i) => (
                <span key={i} style={{ fontSize: "0.75rem", color: "#34d399", background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.2)", padding: "0.15rem 0.5rem", borderRadius: "100px", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                  <Check size={10} /> {comp}
                </span>
              ))}
            </div>
          )}

          {/* Vector Embedding Snippet badge inspector */}
          {patent.similarity?.patentEmbeddingSnippet && (
            <div style={{ fontSize: "0.725rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)", background: "rgba(255,255,255,0.02)", padding: "0.35rem 0.6rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", marginBottom: "1rem" }}>
              Vector: {patent.similarity.patentEmbeddingSnippet}
            </div>
          )}

          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.8rem", color: "var(--text-muted)", borderTop: "1px solid var(--border-color)", paddingTop: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <User size={12} />
              <span>Assignee: {patent.assignee}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <Calendar size={12} />
              <span>Pub: {formatDate(patent.publicationDate)}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Score circle and action buttons */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", minWidth: "130px" }}>
          <SimilarityScore 
            score={patent.similarity?.overallScore || 0} 
            variant={getScoreVariant(patent.similarity?.overallScore || 0)}
          />
          
          <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
            <button
              type="button"
              className="btn btn-secondary"
              title={isSaved ? "Remove from bookmarks" : "Save bookmark"}
              onClick={() => onToggleSave(patent.id)}
              style={{ padding: "0.5rem", borderRadius: "var(--radius-md)" }}
            >
              <Bookmark size={16} fill={isSaved ? "var(--accent-purple-mid)" : "none"} stroke={isSaved ? "var(--accent-purple-mid)" : "currentColor"} />
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              title="Compare side by side in Workspace"
              onClick={() => onCompare(patent)}
              style={{ padding: "0.5rem", flex: 1, fontSize: "0.8rem" }}
            >
              <ArrowRight size={14} /> Compare
            </button>
          </div>

          <Link
            to={`/patents/details?id=${patent.id}`}
            className="btn btn-primary"
            style={{ width: "100%", padding: "0.5rem 1rem", fontSize: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
          >
            <FileText size={14} /> Full Details
          </Link>
        </div>

      </div>

      {/* MODULE 8: Disclaimer footnote */}
      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", borderTop: "1px dashed var(--border-color)", marginTop: "1rem", paddingTop: "0.5rem", textAlign: "left" }}>
        * AI-generated similarity score for preliminary research. Not a legal conclusion regarding patent infringement or patentability.
      </div>
    </Card>
  );
}

export default PatentCard;
