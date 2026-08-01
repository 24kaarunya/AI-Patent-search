import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { History, Trash2, ArrowRight, RotateCcw } from "lucide-react";
import { authService } from "../../services/authService";
import { searchService } from "../../services/searchService";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { formatDate } from "../../utils/formatters";

export function SearchHistory() {
  const [currentUser] = useState(() => authService.getCurrentUser());
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      loadHistory();
    }
  }, [currentUser]);

  const loadHistory = async () => {
    const list = await searchService.getSearchHistory(currentUser.email);
    setLogs(list);
  };

  const handleClearHistory = async () => {
    if (window.confirm("Are you sure you want to clear your entire search query log history? This action is permanent.")) {
      // Loop delete for simplicity or clear
      for (const log of logs) {
        await searchService.deleteSearchHistoryItem(currentUser.email, log.id);
      }
      setLogs([]);
    }
  };

  const handleDeleteSingle = async (logId, e) => {
    e.stopPropagation();
    if (window.confirm("Delete this search record from your archives?")) {
      await searchService.deleteSearchHistoryItem(currentUser.email, logId);
      await loadHistory();
    }
  };

  const handleLoadQuery = (log) => {
    navigate("/invention", { state: { loadedInvention: log } });
  };

  return (
    <div className="fade-in" style={{ textAlign: "left", maxWidth: "900px", margin: "0 auto" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.75rem", color: "#fff", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <History size={24} style={{ color: "var(--accent-purple)" }} />
            Search History Archives
          </h2>
          <p style={{ color: "var(--text-secondary)" }}>
            Review past invention queries, re-run vector matches, or delete individual search records.
          </p>
        </div>

        {logs.length > 0 && (
          <Button variant="danger" onClick={handleClearHistory} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Trash2 size={16} /> Clear All Logs
          </Button>
        )}
      </div>

      {logs.length === 0 ? (
        <Card style={{ padding: "5rem 2rem", textAlign: "center", color: "var(--text-muted)" }}>
          <History size={40} style={{ color: "var(--border-glow)", marginBottom: "0.5rem" }} />
          <p style={{ marginBottom: "1rem" }}>No search history has been logged on this account yet.</p>
          <Button onClick={() => navigate("/invention")}>Analyze Your First Invention</Button>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {logs.map((log) => (
            <Card key={log.id} style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                    <Badge variant="purple">{log.domain}</Badge>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      Analyzed: {formatDate(log.timestamp)}
                    </span>
                  </div>
                  
                  <h3 style={{ fontSize: "1.2rem", color: "#fff", marginBottom: "0.5rem" }}>{log.title}</h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1rem", lineClamp: 2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {log.description}
                  </p>

                  {/* Components and Functions chips */}
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>Components:</span>
                    {(log.components || []).slice(0, 4).map((c, i) => (
                      <span key={i} style={{ fontSize: "0.75rem", background: "rgba(255,255,255,0.01)", border: "1px solid var(--border-color)", padding: "0.1rem 0.4rem", borderRadius: "4px" }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "1rem", minWidth: "180px" }}>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)" }}>Conflicting Prior Art:</span>
                    <strong style={{ fontSize: "1.1rem", color: log.topScore > 70 ? "var(--accent-red)" : log.topScore > 40 ? "var(--accent-amber)" : "var(--accent-green)" }}>
                      {log.matchCount} Patents (Max: {log.topScore}%)
                    </strong>
                  </div>
                  
                  <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      title="Delete single search entry"
                      onClick={(e) => handleDeleteSingle(log.id, e)}
                      style={{ padding: "0.5rem" }}
                    >
                      <Trash2 size={14} style={{ color: "var(--accent-red)" }} />
                    </button>
                    
                    <Button 
                      variant="primary" 
                      onClick={() => handleLoadQuery(log)}
                      style={{ fontSize: "0.8rem", padding: "0.5rem 0.75rem", flex: 1, display: "flex", alignItems: "center", gap: "0.25rem", justifyContent: "center" }}
                    >
                      <RotateCcw size={12} /> Re-run Search
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
}

export default SearchHistory;
