import React from "react";
import { FileText, Cpu, Scissors, Database, Layers, CheckCircle } from "lucide-react";
import { Card } from "../common/Card";

export function PreprocessingPipeline() {
  const steps = [
    { title: "Original Patent Document", desc: "PDF / Plain Text Ingestion", icon: <FileText size={18} style={{ color: "var(--accent-purple)" }} /> },
    { title: "Text Extraction", desc: "OCR & Character Sanitizing", icon: <Scissors size={18} style={{ color: "var(--accent-teal)" }} /> },
    { title: "Text Cleaning", desc: "Stopword & Noise Filtering", icon: <CheckCircle size={18} style={{ color: "var(--accent-green)" }} /> },
    { title: "Section Extraction", desc: "Abstract, Claims & Specs", icon: <Layers size={18} style={{ color: "var(--accent-amber)" }} /> },
    { title: "Text Chunking", desc: "512-Token Sliding Windows", icon: <Cpu size={18} style={{ color: "var(--accent-purple)" }} /> },
    { title: "Vector Embeddings", desc: "FAISS / ChromaDB Indexing", icon: <Database size={18} style={{ color: "var(--accent-teal)" }} /> }
  ];

  return (
    <Card style={{ marginBottom: "1.5rem" }}>
      <h4 style={{ color: "#fff", fontSize: "1rem", marginBottom: "1rem", textAlign: "left" }}>
        Patent Document Preprocessing Pipeline
      </h4>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.75rem" }}>
        {steps.map((step, idx) => (
          <div key={idx} style={{ padding: "0.75rem", background: "rgba(255,255,255,0.01)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.35rem" }}>
              {step.icon}
            </div>
            <span style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#fff" }}>{step.title}</span>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{step.desc}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default PreprocessingPipeline;
