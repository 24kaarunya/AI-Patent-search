import React from "react";
import { formatDate } from "../../utils/formatters";

export function PatentReportView({ invention, nlpAnalysis, noveltyAnalysis, matchedPatents }) {
  if (!invention) return null;

  const reportId = `REP-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
  const timestamp = formatDate(new Date().toISOString()) + " " + new Date().toLocaleTimeString();

  const topPatent = matchedPatents && matchedPatents.length > 0 ? matchedPatents[0] : null;

  // Extract unique project features
  const projectFeatures = [
    ...(invention.components || []),
    ...(invention.functions || [])
  ];
  const uniqueProjectFeatures = Array.from(new Set(projectFeatures));

  // Determine common and different features compared to top patent
  const commonFeaturesList = uniqueProjectFeatures.filter(feat => {
    if (!topPatent) return false;
    const inComponents = (topPatent.components || []).some(c => c.toLowerCase() === feat.toLowerCase());
    const inFunctions = (topPatent.functions || []).some(f => f.toLowerCase() === feat.toLowerCase());
    return inComponents || inFunctions;
  });

  const differentFeaturesList = uniqueProjectFeatures.filter(feat => {
    if (!topPatent) return true;
    const inComponents = (topPatent.components || []).some(c => c.toLowerCase() === feat.toLowerCase());
    const inFunctions = (topPatent.functions || []).some(f => f.toLowerCase() === feat.toLowerCase());
    return !(inComponents || inFunctions);
  });

  // AI Comparison Explanation dynamic calculation
  const aiExplanationText = topPatent 
    ? `Both the project "${invention.title}" and the patent "${topPatent.title}" (${topPatent.patentNumber}) use similar technical concepts. Specifically, they both share common capabilities and components such as ${commonFeaturesList.slice(0, 3).join(", ") || "basic system structures"}. However, the project additionally implements unique features, including ${differentFeaturesList.slice(0, 3).join(", ") || "specialized interfaces and processing workflows"}, which were not identified in the compared patent. These differences represent additional project features providing substantial novelty.`
    : `No matching prior-art patents were found that exceed the threshold. Consequently, the project does not share overlapping features with existing records, indicating high distinctiveness and individual claim isolation capability.`;

  return (
    <div style={{ 
      backgroundColor: "#fff", 
      color: "#111827", 
      padding: "2.5rem", 
      borderRadius: "8px", 
      fontFamily: "var(--font-sans)",
      textAlign: "left",
      lineHeight: "1.6",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    }}>
      
      {/* Report Header */}
      <div style={{ borderBottom: "3px solid #4f46e5", paddingBottom: "1.5rem", marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ color: "#1e1b4b", fontSize: "2rem", fontWeight: 800, margin: 0 }}>
            PROJECT–PATENT COMPARISON REPORT
          </h1>
          <p style={{ color: "#4f46e5", fontWeight: 700, fontSize: "0.95rem", margin: "0.25rem 0 0 0" }}>
            Prior-Art Similarity & Feature-by-Feature Analysis (14 Core Sections)
          </p>
        </div>
        <div style={{ textAlign: "right", fontSize: "0.85rem", color: "#6b7280" }}>
          <div><strong>Report ID:</strong> {reportId}</div>
          <div><strong>Generated:</strong> {timestamp}</div>
          <div><strong>System:</strong> PATENT.AI v1.0.0</div>
        </div>
      </div>

      {/* 1. Project Information */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ color: "#1e1b4b", fontSize: "1.2rem", fontWeight: 700, borderBottom: "1px solid #e5e7eb", paddingBottom: "0.4rem" }}>
          1. Project Information
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", backgroundColor: "#f9fafb", padding: "1rem", borderRadius: "6px", marginTop: "0.5rem", fontSize: "0.9rem" }}>
          <div><strong>Project Title:</strong> {invention.title}</div>
          <div><strong>Classification Domain:</strong> {invention.domain}</div>
          <div><strong>Filing / Generation Date:</strong> {formatDate(new Date().toISOString())}</div>
          <div><strong>Target Registries:</strong> USPTO, EPO, WIPO</div>
        </div>
      </div>

      {/* 2. Project Description */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ color: "#1e1b4b", fontSize: "1.2rem", fontWeight: 700, borderBottom: "1px solid #e5e7eb", paddingBottom: "0.4rem" }}>
          2. Project Description
        </h2>
        <p style={{ fontSize: "0.95rem", color: "#374151", marginTop: "0.5rem", whiteSpace: "pre-line" }}>
          {invention.description}
        </p>
      </div>

      {/* 3. AI-Extracted Technical Features */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ color: "#1e1b4b", fontSize: "1.2rem", fontWeight: 700, borderBottom: "1px solid #e5e7eb", paddingBottom: "0.4rem" }}>
          3. AI-Extracted Technical Features
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "0.5rem" }}>
          <div>
            <strong style={{ color: "#4f46e5", fontSize: "0.9rem" }}>Extracted Components (Hardware / Systems):</strong>
            <ul style={{ paddingLeft: "1.2rem", margin: "0.4rem 0", fontSize: "0.9rem" }}>
              {(invention.components || []).map((c, i) => <li key={i} style={{ marginBottom: "0.25rem" }}>{c}</li>)}
            </ul>
          </div>
          <div>
            <strong style={{ color: "#4f46e5", fontSize: "0.9rem" }}>System Functions (Capabilities):</strong>
            <ul style={{ paddingLeft: "1.2rem", margin: "0.4rem 0", fontSize: "0.9rem" }}>
              {(invention.functions || []).map((f, i) => <li key={i} style={{ marginBottom: "0.25rem" }}>{f}</li>)}
            </ul>
          </div>
        </div>
      </div>

      {/* 4. Search Method */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ color: "#1e1b4b", fontSize: "1.2rem", fontWeight: 700, borderBottom: "1px solid #e5e7eb", paddingBottom: "0.4rem" }}>
          4. Search Method
        </h2>
        <p style={{ fontSize: "0.95rem", color: "#374151", marginTop: "0.5rem" }}>
          The prior-art search was executed utilizing a <strong>Sentence Transformer model</strong> which converts project descriptions into 384-dimensional dense numerical vector representations. These embeddings are compared using <strong>Cosine Similarity calculations</strong> against indexed patents to evaluate semantic overlap. High similarity indexes highlight prior art regardless of distinct word choices.
        </p>
      </div>

      {/* 5. Patent Source */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ color: "#1e1b4b", fontSize: "1.2rem", fontWeight: 700, borderBottom: "1px solid #e5e7eb", paddingBottom: "0.4rem" }}>
          5. Patent Source
        </h2>
        <p style={{ fontSize: "0.95rem", color: "#374151", marginTop: "0.5rem" }}>
          Patent records were queried from genuine databases and official sources, including the <strong>United States Patent and Trademark Office (USPTO)</strong>, the <strong>European Patent Office (EPO)</strong>, and the <strong>World Intellectual Property Organization (WIPO)</strong>.
        </p>
      </div>

      {/* 6. Matching Patents */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ color: "#1e1b4b", fontSize: "1.2rem", fontWeight: 700, borderBottom: "1px solid #e5e7eb", paddingBottom: "0.4rem" }}>
          6. Matching Patents
        </h2>
        {matchedPatents && matchedPatents.length > 0 ? (
          <ul style={{ paddingLeft: "1.2rem", margin: "0.5rem 0", fontSize: "0.9rem" }}>
            {matchedPatents.map((p, i) => (
              <li key={p.id} style={{ marginBottom: "0.4rem" }}>
                <strong>{p.patentNumber}</strong> — {p.title} (Applicant: <em>{p.assignee}</em>)
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ fontSize: "0.95rem", color: "#6b7280", fontStyle: "italic", marginTop: "0.5rem" }}>
            No matching patents found above similarity threshold.
          </p>
        )}
      </div>

      {/* 7. Similarity Scores */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ color: "#1e1b4b", fontSize: "1.2rem", fontWeight: 700, borderBottom: "1px solid #e5e7eb", paddingBottom: "0.4rem" }}>
          7. Similarity Scores
        </h2>
        {matchedPatents && matchedPatents.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "0.5rem", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#f3f4f6", textAlign: "left" }}>
                <th style={{ padding: "0.6rem 0.75rem", border: "1px solid #d1d5db" }}>Patent ID</th>
                <th style={{ padding: "0.6rem 0.75rem", border: "1px solid #d1d5db" }}>Patent Title</th>
                <th style={{ padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", textAlign: "center" }}>Overall Similarity Score</th>
              </tr>
            </thead>
            <tbody>
              {matchedPatents.map((patent) => (
                <tr key={patent.id}>
                  <td style={{ padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", fontFamily: "monospace" }}>{patent.patentNumber}</td>
                  <td style={{ padding: "0.6rem 0.75rem", border: "1px solid #d1d5db" }}>{patent.title}</td>
                  <td style={{ padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", textAlign: "center", fontWeight: 800, color: patent.similarity.overallScore > 70 ? "#dc2626" : "#d97706" }}>
                    {patent.similarity.overallScore}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ fontSize: "0.95rem", color: "#6b7280", fontStyle: "italic", marginTop: "0.5rem" }}>
            No similarity scores calculated.
          </p>
        )}
      </div>

      {/* 8. Detailed Feature Comparison */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ color: "#1e1b4b", fontSize: "1.2rem", fontWeight: 700, borderBottom: "1px solid #e5e7eb", paddingBottom: "0.4rem" }}>
          8. Detailed Feature Comparison
        </h2>
        {topPatent ? (
          <div>
            <p style={{ fontSize: "0.85rem", color: "#6b7280", margin: "0.25rem 0 0.5rem 0" }}>
              Comparing project features with top matching patent: <strong>{topPatent.patentNumber} ({topPatent.title})</strong>
            </p>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "0.5rem", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#f3f4f6", textAlign: "left" }}>
                  <th style={{ padding: "0.6rem 0.75rem", border: "1px solid #d1d5db" }}>Technical Feature</th>
                  <th style={{ padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", textAlign: "center" }}>Project</th>
                  <th style={{ padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", textAlign: "center" }}>Patent</th>
                  <th style={{ padding: "0.6rem 0.75rem", border: "1px solid #d1d5db" }}>Result</th>
                </tr>
              </thead>
              <tbody>
                {uniqueProjectFeatures.map((feat, i) => {
                  const inPatent = (topPatent.components || []).some(c => c.toLowerCase() === feat.toLowerCase()) || 
                                   (topPatent.functions || []).some(f => f.toLowerCase() === feat.toLowerCase());
                  return (
                    <tr key={i}>
                      <td style={{ padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", fontWeight: 600 }}>{feat}</td>
                      <td style={{ padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", textAlign: "center" }}>Yes</td>
                      <td style={{ padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", textAlign: "center", color: inPatent ? "#dc2626" : "#6b7280" }}>
                        {inPatent ? "Yes" : "No"}
                      </td>
                      <td style={{ padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", color: inPatent ? "#dc2626" : "#059669", fontWeight: 600 }}>
                        {inPatent ? "Common" : "Different"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ fontSize: "0.95rem", color: "#6b7280", fontStyle: "italic", marginTop: "0.5rem" }}>
            No prior art available for side-by-side comparison.
          </p>
        )}
      </div>

      {/* 9. Common Features */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ color: "#1e1b4b", fontSize: "1.2rem", fontWeight: 700, borderBottom: "1px solid #e5e7eb", paddingBottom: "0.4rem" }}>
          9. Common Features
        </h2>
        {commonFeaturesList.length > 0 ? (
          <ul style={{ paddingLeft: "1.2rem", margin: "0.5rem 0", fontSize: "0.9rem" }}>
            {commonFeaturesList.map((feat, i) => (
              <li key={i} style={{ marginBottom: "0.25rem" }}>
                <strong>{feat}</strong> — Shared functional concept or hardware module.
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ fontSize: "0.95rem", color: "#6b7280", fontStyle: "italic", marginTop: "0.5rem" }}>
            No common features identified.
          </p>
        )}
      </div>

      {/* 10. Different Features */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ color: "#1e1b4b", fontSize: "1.2rem", fontWeight: 700, borderBottom: "1px solid #e5e7eb", paddingBottom: "0.4rem" }}>
          10. Different Features
        </h2>
        {differentFeaturesList.length > 0 ? (
          <ul style={{ paddingLeft: "1.2rem", margin: "0.5rem 0", fontSize: "0.9rem" }}>
            {differentFeaturesList.map((feat, i) => (
              <li key={i} style={{ marginBottom: "0.25rem" }}>
                <strong>{feat}</strong> — Distinctive capability or component exclusive to the user project.
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ fontSize: "0.95rem", color: "#6b7280", fontStyle: "italic", marginTop: "0.5rem" }}>
            No distinctive features identified.
          </p>
        )}
      </div>

      {/* 11. AI Comparison Explanation */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ color: "#1e1b4b", fontSize: "1.2rem", fontWeight: 700, borderBottom: "1px solid #e5e7eb", paddingBottom: "0.4rem" }}>
          11. AI Comparison Explanation
        </h2>
        <p style={{ fontSize: "0.95rem", color: "#374151", marginTop: "0.5rem", lineHeight: "1.6" }}>
          {aiExplanationText}
        </p>
      </div>

      {/* 12. Comparison Summary */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ color: "#1e1b4b", fontSize: "1.2rem", fontWeight: 700, borderBottom: "1px solid #e5e7eb", paddingBottom: "0.4rem" }}>
          12. Comparison Summary
        </h2>
        <div style={{ fontSize: "0.95rem", color: "#374151", marginTop: "0.5rem" }}>
          <p style={{ margin: "0 0 0.5rem 0" }}>
            <strong>Calculated Novelty Index:</strong> {noveltyAnalysis?.noveltyScore ?? 100}% ({noveltyAnalysis?.noveltyLevel ?? "High"} Novelty)
          </p>
          <p style={{ margin: 0 }}>
            {noveltyAnalysis?.reasoning || "The project shows an excellent novelty profile compared to existing databases."}
          </p>
        </div>
      </div>

      {/* 13. Original Patent References */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ color: "#1e1b4b", fontSize: "1.2rem", fontWeight: 700, borderBottom: "1px solid #e5e7eb", paddingBottom: "0.4rem" }}>
          13. Original Patent References
        </h2>
        {matchedPatents && matchedPatents.length > 0 ? (
          <ul style={{ paddingLeft: "1.2rem", margin: "0.5rem 0", fontSize: "0.85rem", color: "#4b5563" }}>
            {matchedPatents.map(p => (
              <li key={p.id} style={{ marginBottom: "0.35rem" }}>
                <strong>{p.patentNumber}:</strong> {p.title} — Google Patents:{" "}
                <a href={`https://patents.google.com/patent/${p.patentNumber.replace(/-/g, "")}/en`} target="_blank" rel="noreferrer" style={{ color: "#4f46e5", textDecoration: "underline" }}>
                  https://patents.google.com/patent/{p.patentNumber}/en
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ fontSize: "0.95rem", color: "#6b7280", fontStyle: "italic", marginTop: "0.5rem" }}>
            No references generated.
          </p>
        )}
      </div>

      {/* 14. Disclaimer */}
      <div style={{ borderTop: "2px solid #e5e7eb", paddingTop: "1rem", fontSize: "0.8rem", color: "#6b7280", fontStyle: "italic" }}>
        <strong>14. Legal Disclaimer:</strong> This document represents an AI-assisted research summary and semantic similarity calculation generated by PATENT.AI. It is intended exclusively for preliminary prior-art investigation and does NOT constitute a legal opinion, formal patentability determination, or legal advice regarding patent infringement.
      </div>

    </div>
  );
}

export default PatentReportView;
