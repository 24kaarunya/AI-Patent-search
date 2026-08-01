import React, { useState, useEffect } from "react";
import { Search, Info, Sliders, CheckCircle, Bookmark } from "lucide-react";
import { searchService } from "../../services/searchService";
import { authService } from "../../services/authService";
import { Card } from "../../components/common/Card";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { PatentCard } from "../../components/patent/PatentCard";
import { Modal } from "../../components/common/Modal";
import { PatentSummary } from "../../components/patent/PatentSummary";
import { PatentComparison } from "../../components/patent/PatentComparison";

export function PatentSearch() {
  const [currentUser] = useState(() => authService.getCurrentUser());
  const [query, setQuery] = useState("");
  const [threshold, setThreshold] = useState(() => {
    return parseInt(localStorage.getItem("patent_search_threshold") || "15", 10);
  });
  
  // Custom filters
  const [selectedClassification, setSelectedClassification] = useState("All");
  const [matchSections, setMatchSections] = useState({
    abstract: true,
    claims: true,
    description: false
  });

  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [savedIds, setSavedIds] = useState([]);

  // Modals
  const [selectedPatent, setSelectedPatent] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [comparePatent, setComparePatent] = useState(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const openDetails = (patent) => {
    setSelectedPatent(patent);
    setIsDetailsOpen(true);
  };

  const openCompare = (patent) => {
    setComparePatent(patent);
    setIsCompareOpen(true);
  };

  useEffect(() => {
    async function initPage() {
      if (currentUser) {
        const saved = await searchService.getSavedPatentIds(currentUser.email);
        setSavedIds(saved);
      }
      setResults([]);
      setSearched(false);
    }
    initPage();
  }, [currentUser]);

  const handleThresholdChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setThreshold(val);
    localStorage.setItem("patent_search_threshold", val.toString());
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    // Build mock invention model from search keywords to pass to similarity engine
    const searchInvention = {
      title: query,
      description: query,
      domain: selectedClassification !== "All" ? selectedClassification : "IoT + AI",
      components: query.split(/\s+/).filter(w => w.length > 4),
      functions: query.split(/\s+/).filter(w => w.length > 5)
    };

    const hits = await searchService.searchPatents(searchInvention, threshold);
    
    // Filter results if classification domain is pinned
    const filteredHits = selectedClassification === "All" 
      ? hits 
      : hits.filter(p => p.classification.toLowerCase() === selectedClassification.toLowerCase());

    setResults(filteredHits);
    setSearched(true);
  };

  const handleToggleSave = async (patentId) => {
    if (currentUser) {
      await searchService.toggleSavePatent(currentUser.email, patentId);
      const saved = await searchService.getSavedPatentIds(currentUser.email);
      setSavedIds(saved);
    }
  };

  return (
    <div className="fade-in" style={{ textAlign: "left" }}>
      
      {/* Title */}
      <h2 style={{ fontSize: "1.75rem", marginBottom: "1.5rem" }}>Semantic Prior-Art Patent Database</h2>

      <div style={{ display: "grid", gridTemplateColumns: "0.7fr 1.3fr", gap: "1.5rem" }}>
        
        {/* Filters/Query Card */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <Card>
            <h3 style={{ color: "#fff", fontSize: "1.1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Sliders size={18} style={{ color: "var(--accent-purple)" }} />
              Query Parameters
            </h3>

            <form onSubmit={handleSearch} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <Input
                id="search-query"
                label="Search Keyword or Semantic Concept"
                placeholder="e.g. fatigue anomaly buzzer"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
              />

              {/* Classification dropdown */}
              <div className="form-group">
                <label className="form-label">Filter Technology Classification</label>
                <select 
                  className="form-control"
                  value={selectedClassification}
                  onChange={(e) => setSelectedClassification(e.target.value)}
                >
                  <option value="All">All technology classifications</option>
                  <option value="IoT + AI">IoT + AI</option>
                  <option value="IoT + Health">IoT + Health</option>
                  <option value="Blockchain">Blockchain</option>
                  <option value="Robotics + AI">Robotics + AI</option>
                  <option value="IoT + NLP">IoT + NLP</option>
                  <option value="Renewable Energy">Renewable Energy</option>
                  <option value="IoT + Agriculture">IoT + Agriculture</option>
                  <option value="Wearables + AR">Wearables + AR</option>
                  <option value="Cybersecurity + AI">Cybersecurity + AI</option>
                </select>
              </div>

              {/* Sections to check */}
              <div className="form-group">
                <label className="form-label" style={{ marginBottom: "0.25rem" }}>Matching Document Sections</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", cursor: "pointer" }}>
                    <input 
                      type="checkbox" 
                      checked={matchSections.abstract} 
                      onChange={(e) => setMatchSections({...matchSections, abstract: e.target.checked})}
                      style={{ accentColor: "var(--accent-purple)" }}
                    />
                    <span>Abstract Metadata</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", cursor: "pointer" }}>
                    <input 
                      type="checkbox" 
                      checked={matchSections.claims} 
                      onChange={(e) => setMatchSections({...matchSections, claims: e.target.checked})}
                      style={{ accentColor: "var(--accent-purple)" }}
                    />
                    <span>Patent Claims</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", cursor: "pointer" }}>
                    <input 
                      type="checkbox" 
                      checked={matchSections.description} 
                      onChange={(e) => setMatchSections({...matchSections, description: e.target.checked})}
                      style={{ accentColor: "var(--accent-purple)" }}
                    />
                    <span>Full Text Descriptions</span>
                  </label>
                </div>
              </div>

              {/* Threshold Slider */}
              <div className="form-group">
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 600 }}>
                  <span>Min Similarity Score</span>
                  <span style={{ color: "var(--accent-purple)" }}>{threshold}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={threshold}
                  onChange={handleThresholdChange}
                  style={{ width: "100%", accentColor: "var(--accent-purple)" }}
                />
              </div>

              <Button type="submit" variant="primary" style={{ width: "100%", marginTop: "0.5rem" }}>
                <Search size={16} /> Execute Search
              </Button>
            </form>
          </Card>

          <Card style={{ padding: "1.25rem", display: "flex", gap: "0.5rem", alignItems: "flex-start", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            <Info size={16} style={{ color: "var(--accent-teal)", flexShrink: 0, marginTop: "0.1rem" }} />
            <p>
              Under the hood, the system tokenizes input phrases, removes common noise words, computes a normalized TF-IDF matrix, and maps Cosine Similarity indexes to document vectors.
            </p>
          </Card>
        </div>

        {/* Results Column */}
        <div>
          <h3 style={{ color: "#fff", fontSize: "1.2rem", marginBottom: "1rem" }}>
            Search Results {searched && `(${results.length} matched)`}
          </h3>

          {!searched ? (
            <Card style={{ padding: "5rem 2rem", textAlign: "center", color: "var(--text-muted)" }}>
              <Search size={36} style={{ color: "var(--border-glow)", marginBottom: "0.5rem" }} />
              <p>Type a keyword or concept query to search the active patent database.</p>
            </Card>
          ) : results.length === 0 ? (
            <Card style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--text-muted)" }}>
              <CheckCircle size={32} style={{ color: "var(--accent-green)", marginBottom: "0.5rem" }} />
              <p>No matching patents exceeded your similarity threshold. Try reducing the min score or revising keyword filters.</p>
            </Card>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {results.map(patent => (
                <PatentCard
                  key={patent.id}
                  patent={patent}
                  isSaved={savedIds.includes(patent.id)}
                  onToggleSave={handleToggleSave}
                  onViewDetails={openDetails}
                  onCompare={openCompare}
                />
              ))}
            </div>
          )}
        </div>

      </div>

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
          invention={{ title: query, description: query, domain: selectedClassification, components: query.split(/\s+/), functions: query.split(/\s+/) }} 
          patent={comparePatent} 
        />
      </Modal>

    </div>
  );
}

export default PatentSearch;
