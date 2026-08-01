import React, { useState, useEffect, useCallback } from "react";
import { Bookmark, Info } from "lucide-react";
import { authService } from "../../services/authService";
import { searchService } from "../../services/searchService";
import { Card } from "../../components/common/Card";
import { PatentCard } from "../../components/patent/PatentCard";
import { Modal } from "../../components/common/Modal";
import { PatentSummary } from "../../components/patent/PatentSummary";
import { PatentComparison } from "../../components/patent/PatentComparison";
import { Button } from "../../components/common/Button";

export function SavedPatents() {
  const [currentUser] = useState(() => authService.getCurrentUser());
  const [savedPatents, setSavedPatents] = useState([]);
  
  // Modals
  const [selectedPatent, setSelectedPatent] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [comparePatent, setComparePatent] = useState(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const loadSavedPatents = useCallback(async () => {
    const list = await searchService.getSavedPatents(currentUser.email);
    const mapped = list.map(p => ({
      ...p,
      similarity: p.similarity || { overallScore: 0, textScore: 0, componentScore: 0, functionScore: 0 }
    }));
    setSavedPatents(mapped);
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadSavedPatents();
    }
  }, [currentUser, loadSavedPatents]);

  const handleToggleSave = async (patentId) => {
    if (currentUser) {
      await searchService.toggleSavePatent(currentUser.email, patentId);
      await loadSavedPatents();
    }
  };

  return (
    <div className="fade-in" style={{ textAlign: "left", maxWidth: "900px", margin: "0 auto" }}>
      
      {/* Header */}
      <h2 style={{ fontSize: "1.75rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Bookmark size={24} style={{ color: "var(--accent-purple)" }} />
        Bookmarked Patents
      </h2>

      {savedPatents.length === 0 ? (
        <Card style={{ padding: "5rem 2rem", textAlign: "center", color: "var(--text-muted)" }}>
          <Bookmark size={40} style={{ color: "var(--border-glow)", marginBottom: "0.5rem" }} />
          <p style={{ marginBottom: "1rem" }}>You have not bookmarked any patents to your workspace yet.</p>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Go to the Patent Search tab or submit an invention to save potential prior-art.
          </p>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", padding: "1rem", background: "rgba(255,255,255,0.01)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
            <Info size={16} style={{ color: "var(--accent-teal)", flexShrink: 0, marginTop: "0.1rem" }} />
            <p>
              These patents are pinned to your profile. Since they are viewed outside a search description context, similarity indexes show 0% baseline until re-evaluated side-by-side with an active invention draft.
            </p>
          </div>

          {savedPatents.map(patent => (
            <PatentCard
              key={patent.id}
              patent={patent}
              isSaved={true}
              onToggleSave={handleToggleSave}
              onViewDetails={(p) => { setSelectedPatent(p); setIsDetailsOpen(true); }}
              onCompare={(p) => { setComparePatent(p); setIsCompareOpen(true); }}
            />
          ))}
        </div>
      )}

      {/* Details modal popup */}
      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Full Patent Specifications"
      >
        <PatentSummary patent={selectedPatent} />
      </Modal>

      {/* Compare modal popup */}
      <Modal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        title="Side-by-side Claim Matrix"
        footer={<Button onClick={() => setIsCompareOpen(false)}>Close Matrix</Button>}
      >
        <PatentComparison 
          invention={{ title: "Saved Patent View", description: "", domain: "General", components: [], functions: [] }} 
          patent={comparePatent} 
        />
      </Modal>

    </div>
  );
}

export default SavedPatents;
