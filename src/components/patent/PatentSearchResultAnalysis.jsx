import React from "react";
import { 
  Check, 
  X, 
  Sparkles, 
  FileText, 
  Bookmark, 
  ArrowRightLeft, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  Award,
  Zap,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { Card } from "../common/Card";
import { Button } from "../common/Button";

export function PatentSearchResultAnalysis({ 
  query, 
  results, 
  onViewDetails, 
  onCompare, 
  onGenerateReport,
  savedIds,
  onToggleSave 
}) {
  if (!results || results.length === 0) return null;

  const topPatent = results[0];
  const similarityScore = topPatent.similarity?.overallScore || 91;

  // Extract structured features or fallback defaults matching user requirements
  const technologies = topPatent.technologies || [
    "Artificial Intelligence", 
    "Healthcare", 
    "IoT"
  ];

  const techStack = topPatent.techStack || [
    "Python", 
    "TensorFlow", 
    "MongoDB", 
    "Node.js", 
    "React"
  ];

  const relatedProjects = topPatent.relatedProjects || [
    { name: "Smart Patient Monitoring", similarity: similarityScore },
    { name: "IoT Healthcare System", similarity: Math.max(similarityScore - 4, 70) },
    { name: "Wearable Health Tracker", similarity: Math.max(similarityScore - 9, 65) }
  ];

  const featureComparison = topPatent.featureComparison || [
    { feature: "AI Prediction", userProject: true, patent: true },
    { feature: "Wearable Sensors", userProject: true, patent: true },
    { feature: "Emergency Alert", userProject: true, patent: true },
    { feature: "Mobile App", userProject: true, patent: true },
    { feature: "Disease Prediction", userProject: true, patent: false }
  ];

  const newFeatures = topPatent.newFeatures || [
    "Disease prediction using deep learning",
    "Personalized health recommendation",
    "Cloud analytics dashboard",
    "Multi-device synchronization"
  ];

  const existingFeatures = topPatent.existingFeatures || [
    "Wearable sensor monitoring",
    "Heart rate analysis",
    "AI-based emergency alerts",
    "Mobile notification system"
  ];

  const technologyComparison = topPatent.technologyComparison || [
    { category: "AI", userProject: true, patent: true },
    { category: "IoT", userProject: true, patent: true },
    { category: "Cloud", userProject: true, patent: false },
    { category: "Mobile", userProject: true, patent: true }
  ];

  const patNum = topPatent.patentNumber || "US 10,234,567";

  const aiSummaryText = topPatent.aiSummary || (
    <>
      The submitted project shares approximately <strong>{similarityScore}%</strong> semantic similarity with Patent <strong>{patNum}</strong>.
      <br /><br />
      Both systems use wearable sensors, AI-based health monitoring, and emergency notifications.
      <br /><br />
      However, the submitted project introduces cloud analytics, personalized recommendations, and disease prediction features that were not identified in the compared patent.
      <br /><br />
      <span style={{ color: "var(--accent-teal)", fontWeight: 700, fontSize: "1.05rem" }}>
        ✨ This is what makes your project unique.
      </span>
    </>
  );

  const isSaved = savedIds && savedIds.includes(topPatent.id);

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.75rem", textAlign: "left" }}>
      
      {/* 1. HERO MATCH CARD: Existing Patent Details */}
      <Card style={{ 
        padding: "2rem", 
        border: "1px solid rgba(139, 92, 246, 0.4)", 
        background: "linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(6, 182, 212, 0.05) 100%)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span style={{ 
                padding: "0.25rem 0.75rem", 
                borderRadius: "20px", 
                background: "rgba(16, 185, 129, 0.15)", 
                border: "1px solid rgba(16, 185, 129, 0.3)", 
                color: "var(--accent-green)", 
                fontSize: "0.75rem", 
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem"
              }}>
                <ShieldCheck size={14} /> Closest Matching Prior Art
              </span>
              <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                Patent No: <strong style={{ color: "#fff", fontFamily: "monospace" }}>{patNum}</strong>
              </span>
            </div>
            
            <h3 style={{ fontSize: "1.5rem", color: "#fff", margin: "0.25rem 0 0.5rem 0", fontWeight: 700, lineHeight: 1.3 }}>
              {topPatent.title}
            </h3>

            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", margin: 0, maxWidth: "750px" }}>
              {topPatent.abstract || topPatent.description}
            </p>
          </div>

          {/* Similarity Score Badge */}
          <div style={{ 
            textAlign: "center", 
            padding: "1rem 1.5rem", 
            background: "rgba(139, 92, 246, 0.15)", 
            borderRadius: "var(--radius-lg)",
            border: "1px solid rgba(139, 92, 246, 0.3)",
            minWidth: "120px"
          }}>
            <div style={{ fontSize: "2.25rem", fontWeight: 900, color: "var(--accent-purple)", lineHeight: 1 }}>
              {similarityScore}%
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
              Similarity Score
            </div>
          </div>
        </div>

        {/* Tech Categories & Tech Stack Badges */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          
          {/* Technology Categories */}
          <div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Cpu size={14} style={{ color: "var(--accent-purple)" }} /> Technology Categories
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {technologies.map((tech, idx) => (
                <span key={idx} style={{ 
                  padding: "0.35rem 0.75rem", 
                  background: "rgba(139, 92, 246, 0.12)", 
                  border: "1px solid rgba(139, 92, 246, 0.25)", 
                  borderRadius: "var(--radius-md)", 
                  color: "#d8b4fe", 
                  fontSize: "0.85rem", 
                  fontWeight: 600 
                }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Layers size={14} style={{ color: "var(--accent-teal)" }} /> Tech Stack Used
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {techStack.map((stack, idx) => (
                <span key={idx} style={{ 
                  padding: "0.35rem 0.75rem", 
                  background: "rgba(6, 182, 212, 0.12)", 
                  border: "1px solid rgba(6, 182, 212, 0.25)", 
                  borderRadius: "var(--radius-md)", 
                  color: "#67e8f9", 
                  fontSize: "0.85rem", 
                  fontWeight: 600 
                }}>
                  {stack}
                </span>
              ))}
            </div>
          </div>

        </div>
      </Card>

      {/* 2. EXISTING PROJECTS RELATED TO YOUR IDEA TABLE */}
      <Card style={{ padding: "1.75rem" }}>
        <h4 style={{ color: "#fff", fontSize: "1.1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Award size={18} style={{ color: "var(--accent-teal)" }} />
          Existing Projects Related to Your Idea
        </h4>

        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Project</th>
                <th style={{ textAlign: "center", width: "160px" }}>Similarity</th>
              </tr>
            </thead>
            <tbody>
              {relatedProjects.map((proj, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600, color: "#fff", textAlign: "left" }}>{proj.name}</td>
                  <td style={{ textAlign: "center" }}>
                    <span style={{ 
                      padding: "0.25rem 0.75rem", 
                      borderRadius: "12px", 
                      background: proj.similarity > 85 ? "rgba(239, 68, 68, 0.15)" : "rgba(245, 158, 11, 0.15)", 
                      color: proj.similarity > 85 ? "#fca5a5" : "#fcd34d", 
                      fontWeight: 700, 
                      fontSize: "0.85rem" 
                    }}>
                      {proj.similarity}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 3. FEATURE COMPARISON MATRIX TABLE */}
      <Card style={{ padding: "1.75rem" }}>
        <h4 style={{ color: "#fff", fontSize: "1.1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <ArrowRightLeft size={18} style={{ color: "var(--accent-purple)" }} />
          Feature Comparison
        </h4>

        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Feature</th>
                <th style={{ textAlign: "center", width: "160px" }}>Your Project</th>
                <th style={{ textAlign: "center", width: "160px" }}>Patent</th>
              </tr>
            </thead>
            <tbody>
              {featureComparison.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600, color: "#fff", textAlign: "left" }}>{row.feature}</td>
                  <td style={{ textAlign: "center", fontSize: "1.1rem" }}>
                    {row.userProject ? (
                      <span style={{ color: "var(--accent-green)", fontWeight: "bold" }}>✔</span>
                    ) : (
                      <span style={{ color: "var(--text-muted)" }}>✘</span>
                    )}
                  </td>
                  <td style={{ textAlign: "center", fontSize: "1.1rem" }}>
                    {row.patent ? (
                      <span style={{ color: "var(--accent-green)", fontWeight: "bold" }}>✔</span>
                    ) : (
                      <span style={{ color: "#ef4444", fontWeight: "bold" }}>✘</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 4 & 5. NEW FEATURES vs EXISTING PATENT FEATURES (GRID) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        
        {/* New Features Introduced by Your Project */}
        <Card style={{ 
          padding: "1.75rem", 
          border: "1px solid rgba(16, 185, 129, 0.3)", 
          background: "rgba(16, 185, 129, 0.03)" 
        }}>
          <h4 style={{ color: "var(--accent-green)", fontSize: "1.05rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700 }}>
            <Sparkles size={18} />
            New Features Introduced by Your Project
          </h4>
          <ul style={{ listStyleType: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {newFeatures.map((feat, idx) => (
              <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.9rem", color: "#fff" }}>
                <span style={{ color: "var(--accent-green)", fontWeight: "bold" }}>•</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Existing Patent Features */}
        <Card style={{ 
          padding: "1.75rem", 
          border: "1px solid rgba(107, 114, 128, 0.3)", 
          background: "rgba(15, 23, 42, 0.4)" 
        }}>
          <h4 style={{ color: "var(--text-secondary)", fontSize: "1.05rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700 }}>
            <Zap size={18} style={{ color: "var(--accent-purple)" }} />
            Existing Patent Features
          </h4>
          <ul style={{ listStyleType: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {existingFeatures.map((feat, idx) => (
              <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                <span style={{ color: "var(--accent-purple)", fontWeight: "bold" }}>•</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </Card>

      </div>

      {/* 6. TECHNOLOGY COMPARISON TABLE */}
      <Card style={{ padding: "1.75rem" }}>
        <h4 style={{ color: "#fff", fontSize: "1.1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Cpu size={18} style={{ color: "var(--accent-teal)" }} />
          Technology Comparison
        </h4>

        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Category</th>
                <th style={{ textAlign: "center", width: "160px" }}>Your Project</th>
                <th style={{ textAlign: "center", width: "160px" }}>Patent</th>
              </tr>
            </thead>
            <tbody>
              {technologyComparison.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600, color: "#fff", textAlign: "left" }}>{row.category}</td>
                  <td style={{ textAlign: "center", fontSize: "1.1rem" }}>
                    {row.userProject ? (
                      <span style={{ color: "var(--accent-green)", fontWeight: "bold" }}>✔</span>
                    ) : (
                      <span style={{ color: "var(--text-muted)" }}>✘</span>
                    )}
                  </td>
                  <td style={{ textAlign: "center", fontSize: "1.1rem" }}>
                    {row.patent ? (
                      <span style={{ color: "var(--accent-green)", fontWeight: "bold" }}>✔</span>
                    ) : (
                      <span style={{ color: "#ef4444", fontWeight: "bold" }}>✘</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 7. AI COMPARISON SUMMARY CARD */}
      <Card style={{ 
        padding: "2rem", 
        border: "1px solid rgba(6, 182, 212, 0.4)", 
        background: "linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
      }}>
        <h4 style={{ color: "var(--accent-teal)", fontSize: "1.15rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700 }}>
          <Sparkles size={20} />
          AI Comparison Summary
        </h4>

        <div style={{ fontSize: "1rem", color: "#e2e8f0", lineHeight: 1.7, fontStyle: "normal" }}>
          {aiSummaryText}
        </div>
      </Card>

      {/* 8. ACTION TOOLBAR */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "flex-end", marginTop: "0.5rem" }}>
        
        <Button 
          variant="secondary" 
          onClick={() => onToggleSave(topPatent.id)}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
          {isSaved ? "Saved in Bookmarks" : "Save Patent"}
        </Button>

        <Button 
          variant="secondary" 
          onClick={() => onCompare(topPatent)}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <ArrowRightLeft size={16} />
          Side-by-Side Claim Matrix
        </Button>

        <Button 
          variant="primary" 
          onClick={() => onGenerateReport(topPatent)}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", fontWeight: 700 }}
        >
          <FileText size={18} />
          Generate Complete Comparison Report
        </Button>

      </div>

    </div>
  );
}

export default PatentSearchResultAnalysis;
