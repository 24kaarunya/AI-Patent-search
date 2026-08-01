import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  FileText, User, Calendar, Tag, ExternalLink, Award,
  Bookmark, ArrowLeft, AlertTriangle, CheckCircle, Star, Copy
} from "lucide-react";
import { patentService } from "../../services/patentService";
import { searchService } from "../../services/searchService";
import { authService } from "../../services/authService";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { formatDate } from "../../utils/formatters";

export function PatentDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const patentId = searchParams.get("id");

  const [patent, setPatent] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentUser] = useState(() => authService.getCurrentUser());

  useEffect(() => {
    if (patentId) {
      const all = patentService.getPatents();
      const found = all.find(p => p.id === patentId);
      setPatent(found || null);

      if (currentUser && found) {
        setIsSaved(searchService.isPatentSaved(currentUser.email, found.id));
      }
    }
  }, [patentId, currentUser]);

  if (!patent) {
    return (
      <div className="fade-in" style={{ textAlign: "center", padding: "5rem 2rem", color: "var(--text-muted)" }}>
        <FileText size={48} style={{ marginBottom: "1rem", color: "var(--border-glow)" }} />
        <h3 style={{ color: "var(--text-secondary)", marginBottom: "0.5rem" }}>Patent Not Found</h3>
        <p style={{ marginBottom: "1.5rem" }}>No patent record matches the requested ID.</p>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft size={14} /> Go Back
        </Button>
      </div>
    );
  }

  const googlePatentsUrl = `https://patents.google.com/patent/${patent.patentNumber.replace(/-/g, "")}/en`;

  const handleToggleSave = () => {
    if (currentUser) {
      const newState = searchService.toggleSavePatent(currentUser.email, patent.id);
      setIsSaved(newState);
    }
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(patent.patentNumber).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score) => {
    if (!score) return "var(--text-muted)";
    if (score >= 70) return "var(--accent-red)";
    if (score >= 40) return "var(--accent-amber)";
    return "var(--accent-green)";
  };

  return (
    <div className="fade-in" style={{ textAlign: "left", maxWidth: "1000px", margin: "0 auto" }}>

      {/* Back Navigation */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="btn btn-secondary"
        style={{ marginBottom: "1.5rem", display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}
      >
        <ArrowLeft size={14} /> Back to Results
      </button>

      {/* Header Card */}
      <Card style={{ marginBottom: "1.5rem", background: "linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(14,165,233,0.04) 100%)", borderColor: "var(--border-glow)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1.5rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem", color: "var(--accent-teal)", fontWeight: 700 }}>
                {patent.patentNumber}
              </span>
              <button type="button" onClick={handleCopyNumber} title="Copy patent number" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "2px" }}>
                {copied ? <CheckCircle size={13} style={{ color: "var(--accent-green)" }} /> : <Copy size={13} />}
              </button>
              <Badge variant={patent.status === "Granted" ? "green" : "amber"}>{patent.status}</Badge>
              <Badge variant="purple">{patent.classification}</Badge>
              <Badge variant="teal">{patent.source}</Badge>
            </div>

            <h1 style={{ fontSize: "1.5rem", color: "#fff", lineHeight: "1.35", marginBottom: "0.5rem" }}>
              {patent.title}
            </h1>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", fontSize: "0.82rem", color: "var(--text-muted)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <User size={12} /> {patent.inventors?.join(", ") || patent.assignee}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <Award size={12} /> {patent.assignee}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <Calendar size={12} /> Filed: {formatDate(patent.filingDate)}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <Calendar size={12} /> Published: {formatDate(patent.publicationDate)}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <Tag size={12} /> {patent.ipcCode}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", minWidth: "140px", alignItems: "flex-end" }}>
            {patent.similarity && (
              <div style={{ textAlign: "center", padding: "0.75rem 1.25rem", background: "rgba(255,255,255,0.03)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "0.2rem" }}>AI Similarity</div>
                <div style={{ fontSize: "1.8rem", fontWeight: 800, color: getScoreColor(patent.similarity.overallScore) }}>
                  {patent.similarity.overallScore}%
                </div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Score Indicator</div>
              </div>
            )}

            <Button
              variant={isSaved ? "secondary" : "teal"}
              onClick={handleToggleSave}
              style={{ width: "100%", fontSize: "0.8rem" }}
            >
              <Bookmark size={14} fill={isSaved ? "var(--accent-purple-mid)" : "none"} />
              {isSaved ? "Bookmarked" : "Save Patent"}
            </Button>

            <a
              href={googlePatentsUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
              style={{ width: "100%", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.4rem", justifyContent: "center" }}
            >
              <ExternalLink size={13} /> View Original
            </a>
          </div>
        </div>
      </Card>

      {/* 2-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.6fr", gap: "1.5rem" }}>

        {/* Left: Full document sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Abstract */}
          <Card>
            <h3 style={{ color: "#fff", fontSize: "1rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FileText size={16} style={{ color: "var(--accent-purple-mid)" }} />
              Abstract
            </h3>
            <p style={{ fontSize: "0.925rem", color: "var(--text-secondary)", lineHeight: "1.7" }}>
              {patent.abstract}
            </p>
          </Card>

          {/* Description */}
          <Card>
            <h3 style={{ color: "#fff", fontSize: "1rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FileText size={16} style={{ color: "var(--accent-teal)" }} />
              Description / Specification
            </h3>
            <p style={{ fontSize: "0.925rem", color: "var(--text-secondary)", lineHeight: "1.7" }}>
              {patent.description}
            </p>
          </Card>

          {/* Claims */}
          <Card>
            <h3 style={{ color: "#fff", fontSize: "1rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <CheckCircle size={16} style={{ color: "var(--accent-green)" }} />
              Patent Claims
            </h3>
            <ol style={{ paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {patent.claims?.map((claim, i) => (
                <li key={i} style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.65", paddingLeft: "0.5rem", borderLeft: "2px solid var(--border-glow)" }}>
                  {claim}
                </li>
              ))}
            </ol>
          </Card>

        </div>

        {/* Right: metadata, features, source */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* AI Similarity Breakdown */}
          {patent.similarity && (
            <Card>
              <h4 style={{ color: "#fff", fontSize: "0.9rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Star size={14} style={{ color: "var(--accent-amber)" }} />
                Similarity Breakdown
              </h4>
              {[
                ["Vector (Semantic)", patent.similarity.vectorScore],
                ["Term (TF-IDF)", patent.similarity.textScore],
                ["Components", patent.similarity.componentScore],
                ["Functions", patent.similarity.functionScore],
              ].map(([label, val]) => (
                <div key={label} style={{ marginBottom: "0.6rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "0.2rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>{label}</span>
                    <span style={{ color: "var(--text-secondary)", fontWeight: 700 }}>{val ?? 0}%</span>
                  </div>
                  <div style={{ height: "5px", background: "rgba(255,255,255,0.05)", borderRadius: "100px", overflow: "hidden" }}>
                    <div style={{ width: `${val ?? 0}%`, height: "100%", background: "var(--gradient-primary)", borderRadius: "100px" }} />
                  </div>
                </div>
              ))}

              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "0.75rem", fontStyle: "italic" }}>
                AI-generated indicator. Not a legal determination of infringement.
              </div>
            </Card>
          )}

          {/* Key Features */}
          <Card>
            <h4 style={{ color: "#fff", fontSize: "0.9rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <CheckCircle size={14} style={{ color: "var(--accent-green)" }} />
              Key Technical Features
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {patent.features?.map((f, i) => (
                <div key={i} style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.35rem 0.6rem", background: "rgba(255,255,255,0.01)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color-soft)" }}>
                  <span style={{ color: "var(--accent-green)", fontSize: "0.75rem" }}>✓</span> {f}
                </div>
              ))}
            </div>
          </Card>

          {/* Source Information */}
          <Card style={{ borderColor: "var(--border-teal-glow)" }}>
            <h4 style={{ color: "#fff", fontSize: "0.9rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ExternalLink size={14} style={{ color: "var(--accent-teal)" }} />
              Patent Source & Reference
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.8rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Registry:</span>
                <Badge variant="teal">{patent.source}</Badge>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>IPC Class:</span>
                <span style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>{patent.ipcCode}</span>
              </div>
            </div>
            <a
              href={googlePatentsUrl}
              target="_blank"
              rel="noreferrer"
              style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.85rem", fontSize: "0.78rem", color: "var(--accent-teal)", textDecoration: "none", wordBreak: "break-all" }}
            >
              <ExternalLink size={11} /> {googlePatentsUrl}
            </a>
          </Card>

          {/* Legal Disclaimer */}
          <div style={{ padding: "0.75rem 1rem", background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: "var(--radius-md)", fontSize: "0.72rem", color: "#fde68a", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
            <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: "1px" }} />
            This patent detail view is for preliminary prior-art research only. It does not constitute legal advice or a patentability opinion.
          </div>

        </div>
      </div>
    </div>
  );
}

export default PatentDetails;
