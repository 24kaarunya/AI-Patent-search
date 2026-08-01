import React, { useState, useEffect } from "react";
import { Settings as SettingsIcon, RotateCcw, ShieldAlert, Check } from "lucide-react";
import { patentService } from "../../services/patentService";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";

export function Settings() {
  const [threshold, setThreshold] = useState(() => {
    return parseInt(localStorage.getItem("patent_search_threshold") || "15", 10);
  });
  const [offlineMode, setOfflineMode] = useState(() => {
    return localStorage.getItem("patent_offline_mode") === "true";
  });
  const [dbResetSuccess, setDbResetSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem("patent_search_threshold", threshold.toString());
  }, [threshold]);

  useEffect(() => {
    localStorage.setItem("patent_offline_mode", offlineMode.toString());
  }, [offlineMode]);

  const handleResetDb = () => {
    patentService.resetDatabase();
    setDbResetSuccess(true);
    setTimeout(() => setDbResetSuccess(false), 3000);
  };

  return (
    <div className="fade-in" style={{ textAlign: "left", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "1.75rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <SettingsIcon size={24} style={{ color: "var(--accent-purple)" }} />
        Portal Configurations & Settings
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* Search settings */}
        <Card>
          <h4 style={{ color: "#fff", fontSize: "1.1rem", marginBottom: "1.25rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
            AI Matching Search Tuners
          </h4>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Slider */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontWeight: 600 }}>
                <span style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>Minimum Similarity Index Threshold</span>
                <span style={{ color: "var(--accent-purple)", fontSize: "1rem" }}>{threshold}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="85"
                step="5"
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value, 10))}
                style={{ width: "100%", accentColor: "var(--accent-purple)", cursor: "pointer" }}
              />
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                Lower thresholds reveal generic matches; higher values show only critical, high-risk prior art.
              </p>
            </div>

            {/* Offline toggle */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-color)", paddingTop: "1.25rem" }}>
              <div>
                <span style={{ display: "block", fontSize: "0.95rem", fontWeight: 600, color: "#fff" }}>Local Offline Vector Engine</span>
                <span style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  Runs similarity cosine index calculations entirely inside the local browser context.
                </span>
              </div>
              <label style={{ position: "relative", display: "inline-block", width: "45px", height: "24px" }}>
                <input
                  type="checkbox"
                  checked={offlineMode}
                  onChange={(e) => setOfflineMode(e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: offlineMode ? "var(--accent-purple)" : "var(--bg-tertiary)",
                  borderRadius: "34px",
                  transition: ".3s",
                  border: "1px solid var(--border-color)"
                }}>
                  <span style={{
                    position: "absolute",
                    content: '""',
                    height: "16px", width: "16px",
                    left: offlineMode ? "24px" : "4px",
                    bottom: "3px",
                    backgroundColor: "white",
                    borderRadius: "50%",
                    transition: ".3s"
                  }}></span>
                </span>
              </label>
            </div>

          </div>
        </Card>

        {/* Database administration */}
        <Card style={{ border: "1px solid rgba(239, 68, 68, 0.15)" }}>
          <h4 style={{ color: "var(--accent-red)", fontSize: "1.1rem", marginBottom: "1.25rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
            System Core Administration
          </h4>

          {dbResetSuccess && (
            <div style={{ padding: "0.75rem 1rem", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "var(--radius-md)", color: "#34d399", fontSize: "0.85rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Check size={16} /> Dataset database restored to initial factory values.
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <ShieldAlert size={16} style={{ color: "var(--accent-red)" }} />
                Factory Dataset Hard-Reset
              </span>
              <span style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                Restores the patent classification matrix to original seeded records, deleting custom user additions.
              </span>
            </div>
            <Button variant="danger" onClick={handleResetDb} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <RotateCcw size={16} /> Restore Seed Data
            </Button>
          </div>
        </Card>

      </div>
    </div>
  );
}

export default Settings;
