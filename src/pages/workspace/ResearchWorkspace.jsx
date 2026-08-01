import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { GitCompare, History, Sparkles, Printer, Cpu } from "lucide-react";
import { authService } from "../../services/authService";
import { searchService } from "../../services/searchService";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { PatentComparison } from "../../components/patent/PatentComparison";
import { ChatAssistant } from "../../components/ai/ChatAssistant";

export function ResearchWorkspace() {
  const [currentUser] = useState(() => authService.getCurrentUser());
  const location = useLocation();

  const [history, setHistory] = useState([]);
  const [activeInvention, setActiveInvention] = useState(null);
  
  // Matched patents for the loaded invention
  const [matchedPatents, setMatchedPatents] = useState([]);
  const [selectedComparePatent, setSelectedComparePatent] = useState(null);

  useEffect(() => {
    if (currentUser) {
      const logs = searchService.getSearchHistory(currentUser.email);
      setHistory(logs);

      // Check if routed with a preloaded invention
      if (location.state && location.state.loadedInvention) {
        loadInvention(location.state.loadedInvention);
      } else if (logs.length > 0) {
        // Default to loading the latest query
        loadInvention(logs[0]);
      }
    }
  }, [currentUser, location]);

  const loadInvention = (invention) => {
    setActiveInvention(invention);
    
    // Perform similarity lookup to retrieve matched patents
    const thresholdVal = parseInt(localStorage.getItem("patent_search_threshold") || "15", 10);
    const matches = searchService.searchPatents(invention, thresholdVal);
    setMatchedPatents(matches);
    
    // Auto-select top match if exists
    if (matches.length > 0) {
      setSelectedComparePatent(matches[0]);
    } else {
      setSelectedComparePatent(null);
    }
  };

  const handlePatentChange = (e) => {
    const patentId = e.target.value;
    const patent = matchedPatents.find(p => p.id === patentId);
    setSelectedComparePatent(patent || null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fade-in" style={{ textAlign: "left" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.75rem", color: "#fff", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <GitCompare size={24} style={{ color: "var(--accent-purple)" }} />
            Prior-Art Comparison Workspace
          </h2>
          <p style={{ color: "var(--text-secondary)" }}>
            Compare your active drafts side-by-side with patented prior-art to refine claims.
          </p>
        </div>

        {activeInvention && (
          <Button variant="teal" onClick={handlePrint} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Printer size={16} /> Export Comparative Sheet
          </Button>
        )}
      </div>

      {/* Select Invention Draft Selector */}
      <Card style={{ marginBottom: "1.5rem", padding: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <History size={16} />
            Active Workspace Draft:
          </span>
          
          {history.length === 0 ? (
            <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
              No invention query logs recorded. <Link to="/invention" style={{ color: "var(--accent-purple)", textDecoration: "none", fontWeight: 600 }}>Create draft now</Link>
            </span>
          ) : (
            <select 
              className="form-control" 
              style={{ maxWidth: "350px", padding: "0.4rem 1rem" }}
              value={activeInvention?.id || ""}
              onChange={(e) => {
                const selected = history.find(h => h.id === e.target.value);
                if (selected) loadInvention(selected);
              }}
            >
              {history.map(log => (
                <option key={log.id} value={log.id}>
                  {log.title}
                </option>
              ))}
            </select>
          )}
        </div>
      </Card>

      {activeInvention ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Compare dropdown and parameters */}
          <Card style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-secondary)" }}>
                  Select Prior Art Patent:
                </span>
                
                {matchedPatents.length === 0 ? (
                  <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                    No matching prior-art patents found for comparison.
                  </span>
                ) : (
                  <select 
                    className="form-control"
                    style={{ maxWidth: "350px", padding: "0.4rem 1rem" }}
                    value={selectedComparePatent?.id || ""}
                    onChange={handlePatentChange}
                  >
                    {matchedPatents.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.patentNumber} — {p.title} ({p.similarity.overallScore}% Match)
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {selectedComparePatent && (
                <div>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    Selected Conflict Risk Index: 
                  </span>
                  <strong style={{ 
                    marginLeft: "0.5rem",
                    color: selectedComparePatent.similarity.overallScore > 70 ? "var(--accent-red)" : selectedComparePatent.similarity.overallScore > 40 ? "var(--accent-amber)" : "var(--accent-green)"
                  }}>
                    {selectedComparePatent.similarity.overallScore}% Similarity
                  </strong>
                </div>
              )}
            </div>
          </Card>

          {/* Matrix side by side compare */}
          {selectedComparePatent ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <PatentComparison invention={activeInvention} patent={selectedComparePatent} />

              <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: "1.5rem" }}>
                {/* Description texts comparison summaries */}
                <Card style={{ textAlign: "left" }}>
                  <h4 style={{ color: "#fff", fontSize: "1.1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Cpu size={18} style={{ color: "var(--accent-teal)" }} />
                    Abstract Comparison
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <div>
                      <strong style={{ fontSize: "0.85rem", color: "var(--accent-purple)", display: "block", marginBottom: "0.25rem" }}>
                        Your Description Snippet:
                      </strong>
                      <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                        {activeInvention.description}
                      </p>
                    </div>
                    <div>
                      <strong style={{ fontSize: "0.85rem", color: "var(--accent-teal)", display: "block", marginBottom: "0.25rem" }}>
                        Prior Art Abstract ({selectedComparePatent.patentNumber}):
                      </strong>
                      <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                        {selectedComparePatent.abstract}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Chat Assistant */}
                <div>
                  <h4 style={{ color: "#fff", fontSize: "1.1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Sparkles size={18} style={{ color: "var(--accent-purple)" }} />
                    Bypass Brainstorm Assistant
                  </h4>
                  <ChatAssistant invention={activeInvention} />
                </div>
              </div>
            </div>
          ) : (
            <Card style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--text-muted)" }}>
              <p>Please analyze an invention or adjust parameters to display comparison metrics.</p>
            </Card>
          )}

        </div>
      ) : (
        <Card style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--text-muted)" }}>
          <p>Please create or select an active query draft to load comparison workspace.</p>
        </Card>
      )}

    </div>
  );
}

export default ResearchWorkspace;
