import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { 
  Lightbulb, 
  Mic, 
  MicOff, 
  Plus, 
  Sparkles, 
  Search, 
  Globe, 
  FileText,
  Printer
} from "lucide-react";

// Services & Utils
import { authService } from "../../services/authService";
import { aiService } from "../../services/aiService";
import { searchService } from "../../services/searchService";
import { voiceService } from "../../services/voiceService";
import { validateInvention } from "../../utils/validators";

// Components
import { Input } from "../../components/common/Input";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";
import { AIAnalysis } from "../../components/ai/AIAnalysis";
import { NoveltyAnalysis } from "../../components/ai/NoveltyAnalysis";
import { PatentCard } from "../../components/patent/PatentCard";
import { PatentSummary } from "../../components/patent/PatentSummary";
import { PatentComparison } from "../../components/patent/PatentComparison";
import { ChatAssistant } from "../../components/ai/ChatAssistant";
import { Modal } from "../../components/common/Modal";
import { PatentReportView } from "../../components/patent/PatentReportView";

export function InventionInput() {
  const [currentUser] = useState(() => authService.getCurrentUser());
  const location = useLocation();

  // Mode: "edit", "loading", "results"
  const [mode, setMode] = useState("edit");
  const [loaderMessage, setLoaderMessage] = useState("");

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("IoT + AI");
  
  // Keyword, Component, Function array tag list
  const [keywords, setKeywords] = useState(["sensors", "rider fatigue", "alert system"]);
  const [components, setComponents] = useState(["Accelerometer", "Biometric Sensors", "Telemetry Transceiver"]);
  const [functions, setFunctions] = useState(["Detect fatigue", "Generate alerts", "Monitor rider"]);
  
  // Tag input temp strings
  const [tempKeyword, setTempKeyword] = useState("");
  const [tempComponent, setTempComponent] = useState("");
  const [tempFunction, setTempFunction] = useState("");

  // Voice Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSupport] = useState(voiceService.isSupported());
  const [voiceInterim, setVoiceInterim] = useState("");

  // Selected language dictionary
  const [inputLang, setInputLang] = useState("en-US");

  // Output Result State
  const [nlpAnalysis, setNlpAnalysis] = useState(null);
  const [noveltyAnalysis, setNoveltyAnalysis] = useState(null);
  const [matchedPatents, setMatchedPatents] = useState([]);
  const [savedPatentsIds, setSavedPatentsIds] = useState([]);

  // Modals & Active Selections
  const [selectedPatent, setSelectedPatent] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [comparePatent, setComparePatent] = useState(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Errors state
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (location.state && location.state.loadedInvention) {
      const inv = location.state.loadedInvention;
      setTitle(inv.title);
      setDescription(inv.description);
      setDomain(inv.domain);
      setKeywords(inv.keywords || []);
      setComponents(inv.components || []);
      setFunctions(inv.functions || []);
      
      handleAnalyze(null, inv);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    async function loadSavedIds() {
      if (currentUser) {
        const saved = await searchService.getSavedPatentIds(currentUser.email);
        setSavedPatentsIds(saved);
      }
    }
    loadSavedIds();
  }, [currentUser, mode]);

  const handleVoiceToggle = () => {
    if (isRecording) {
      voiceService.stopListening();
      setIsRecording(false);
      setVoiceInterim("");
    } else {
      setIsRecording(true);
      setVoiceInterim("Listening...");
      
      if (recordingSupport) {
        voiceService.startListening(
          (result) => {
            if (result.final) {
              setDescription(prev => prev + " " + result.final);
            }
            setVoiceInterim(result.interim || "Transcribing...");
          },
          (err) => {
            console.error(err);
            triggerVoiceSimulation();
          },
          () => {
            setIsRecording(false);
            setVoiceInterim("");
          }
        );
      } else {
        triggerVoiceSimulation();
      }
    }
  };

  const triggerVoiceSimulation = () => {
    voiceService.simulateVoiceRecording(
      (result) => {
        setDescription(result.final);
        setVoiceInterim(result.interim);
      },
      () => {
        setIsRecording(false);
        setVoiceInterim("");
      }
    );
  };

  const addTag = (type) => {
    if (type === "keyword" && tempKeyword.trim()) {
      if (!keywords.includes(tempKeyword.trim())) {
        setKeywords([...keywords, tempKeyword.trim()]);
      }
      setTempKeyword("");
    }
    if (type === "component" && tempComponent.trim()) {
      if (!components.includes(tempComponent.trim())) {
        setComponents([...components, tempComponent.trim()]);
      }
      setTempComponent("");
    }
    if (type === "function" && tempFunction.trim()) {
      if (!functions.includes(tempFunction.trim())) {
        setFunctions([...functions, tempFunction.trim()]);
      }
      setTempFunction("");
    }
  };

  const removeTag = (type, index) => {
    if (type === "keyword") setKeywords(keywords.filter((_, i) => i !== index));
    if (type === "component") setComponents(components.filter((_, i) => i !== index));
    if (type === "function") setFunctions(functions.filter((_, i) => i !== index));
  };

  const handleAnalyze = async (e, loadedInv = null) => {
    if (e) e.preventDefault();
    setErrors({});

    const activeTitle = loadedInv ? loadedInv.title : title;
    const activeDescription = loadedInv ? loadedInv.description : description;
    const activeDomain = loadedInv ? loadedInv.domain : domain;
    const activeComponents = loadedInv ? loadedInv.components : components;
    const activeFunctions = loadedInv ? loadedInv.functions : functions;
    const activeKeywords = loadedInv ? loadedInv.keywords : keywords;

    const validation = validateInvention(
      activeTitle,
      activeDescription,
      activeDomain,
      activeComponents,
      activeFunctions
    );

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setMode("loading");
    setLoaderMessage("Converting invention text, querying real-time patent registers, and executing FAISS semantic matching...");

    try {
      const thresholdVal = parseInt(localStorage.getItem("patent_search_threshold") || "15", 10);
      const inventionObj = {
        title: activeTitle,
        description: activeDescription,
        domain: activeDomain,
        components: activeComponents,
        functions: activeFunctions,
        keywords: activeKeywords
      };
      
      const response = await searchService.analyzeInventionFull(inventionObj, thresholdVal);
      
      setNlpAnalysis(response.analysis);
      setNoveltyAnalysis(response.novelty);
      setMatchedPatents(response.patents);
      setMode("results");
    } catch (err) {
      console.error(err);
      setMode("edit");
      setErrors({ global: "An error occurred during backend AI analysis: " + err.message });
    }
  };

  const handleToggleSavePatent = async (patentId) => {
    if (currentUser) {
      await searchService.toggleSavePatent(currentUser.email, patentId);
      const saved = await searchService.getSavedPatentIds(currentUser.email);
      setSavedPatentsIds(saved);
    }
  };

  const openDetails = (patent) => {
    setSelectedPatent(patent);
    setIsDetailsOpen(true);
  };

  const openCompare = (patent) => {
    setComparePatent(patent);
    setIsCompareOpen(true);
  };

  const triggerSearchRefine = () => {
    setMode("edit");
  };

  const handleExportPDF = () => {
    setIsReportOpen(true);
  };

  return (
    <div className="fade-in" style={{ textAlign: "left" }}>
      
      {/* Page Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h2 style={{ fontSize: "1.75rem", color: "#fff", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Lightbulb size={24} style={{ color: "var(--accent-purple)" }} />
            Invention Analyzer & Prior-Art Matcher
          </h2>
          <p style={{ color: "var(--text-secondary)" }}>
            Describe your idea to automatically extract hardware tags, verify novelty indices, and compare prior art.
          </p>
        </div>
      </div>

      {/* Mode 1: EDIT FORM */}
      {mode === "edit" && (
        <Card>
          {errors.global && (
            <div style={{ padding: "0.75rem 1rem", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "var(--radius-md)", color: "#fca5a5", marginBottom: "1.5rem" }}>
              {errors.global}
            </div>
          )}

          <form onSubmit={(e) => handleAnalyze(e)}>
            
            <Input
              id="inv-title"
              label="Invention Title"
              placeholder="e.g. Smart Helmet with Rider Fatigue Alert Sensors"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
              required
            />

            <div style={{ position: "relative" }}>
              <Input
                id="inv-description"
                label="Detailed Description & System Workflow"
                isTextArea
                rows={6}
                placeholder="Provide a detailed description explaining what your invention is, how it works, and the core problems it solves..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={errors.description}
                required
              />
              
              <div style={{ position: "absolute", right: "12px", top: "34px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {voiceInterim && (
                  <span style={{ fontSize: "0.75rem", color: "var(--accent-red)", animation: "pulse 1.5s infinite" }}>
                    {voiceInterim}
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  className={isRecording ? "pulse-ring" : "btn btn-secondary"}
                  style={isRecording ? { width: "32px", height: "32px", border: "none" } : { padding: "0.4rem" }}
                  title={isRecording ? "Stop recording voice" : "Simulate / Record voice description input"}
                >
                  {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
                </button>
              </div>
            </div>

            <div className="grid-2">
              <Input
                id="inv-domain"
                label="Technology Classification Domain"
                type="select"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                error={errors.domain}
                required
                isTextArea={false}
              >
                <select className="form-control" value={domain} onChange={(e) => setDomain(e.target.value)}>
                  <option value="IoT + AI">IoT + AI (Wearables & Alert Telemetry)</option>
                  <option value="IoT + Health">IoT + Health (EKG Patches & Cardiac Alerts)</option>
                  <option value="Blockchain">Blockchain (NFC Supply Chains & Smart Contracts)</option>
                  <option value="Robotics + AI">Robotics + AI (UAV Drones & Sensor Fusions)</option>
                  <option value="IoT + NLP">IoT + NLP (Offline speech home audio controllers)</option>
                  <option value="Renewable Energy">Renewable Energy (Concentric Solar dual trackers)</option>
                  <option value="IoT + Agriculture">IoT + Agriculture (Moisture Valve schedules)</option>
                  <option value="Wearables + AR">Wearables + AR (transparent headwear gaze trackers)</option>
                  <option value="Cybersecurity + AI">Cybersecurity + AI (anomaly routers autoencoders)</option>
                </select>
              </Input>

              <div className="form-group">
                <label className="form-label">
                  <Globe size={14} /> Multi-Language Input Setting
                </label>
                <select 
                  className="form-control"
                  value={inputLang}
                  onChange={(e) => setInputLang(e.target.value)}
                >
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Spanish (Español)</option>
                  <option value="de-DE">German (Deutsch)</option>
                  <option value="zh-CN">Chinese (中文)</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", margin: "1.5rem 0" }}>
              
              <div className="form-group">
                <label className="form-label">Technology Keywords (Metadata tags)</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="text"
                    value={tempKeyword}
                    onChange={(e) => setTempKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag("keyword"))}
                    placeholder="Add keyword (e.g. bluetooth)"
                    className="form-control"
                    style={{ flex: 1 }}
                  />
                  <Button variant="secondary" onClick={() => addTag("keyword")}>
                    <Plus size={16} /> Add
                  </Button>
                </div>
                <div className="tags-container" style={{ marginTop: "0.5rem" }}>
                  {keywords.map((tag, i) => (
                    <span key={i} className="tag-badge">
                      {tag}
                      <span className="tag-close" onClick={() => removeTag("keyword", i)}>&times;</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  System Components / Hardware Units <span style={{ color: "var(--accent-red)" }}>*</span>
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="text"
                    value={tempComponent}
                    onChange={(e) => setTempComponent(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag("component"))}
                    placeholder="Add component (e.g. buzzer actuator)"
                    className="form-control"
                    style={{ flex: 1 }}
                  />
                  <Button variant="secondary" onClick={() => addTag("component")}>
                    <Plus size={16} /> Add
                  </Button>
                </div>
                {errors.components && <span className="form-error">{errors.components}</span>}
                <div className="tags-container" style={{ marginTop: "0.5rem" }}>
                  {components.map((tag, i) => (
                    <span key={i} className="tag-badge">
                      {tag}
                      <span className="tag-close" onClick={() => removeTag("component", i)}>&times;</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  System Functions / Capabilities <span style={{ color: "var(--accent-red)" }}>*</span>
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="text"
                    value={tempFunction}
                    onChange={(e) => setTempFunction(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag("function"))}
                    placeholder="Add capability (e.g. detect deceleration)"
                    className="form-control"
                    style={{ flex: 1 }}
                  />
                  <Button variant="secondary" onClick={() => addTag("function")}>
                    <Plus size={16} /> Add
                  </Button>
                </div>
                {errors.functions && <span className="form-error">{errors.functions}</span>}
                <div className="tags-container" style={{ marginTop: "0.5rem" }}>
                  {functions.map((tag, i) => (
                    <span key={i} className="tag-badge">
                      {tag}
                      <span className="tag-close" onClick={() => removeTag("function", i)}>&times;</span>
                    </span>
                  ))}
                </div>
              </div>

            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem" }}>
              <Button type="submit" variant="primary">
                <Sparkles size={16} /> Analyze Invention Prior-Art
              </Button>
            </div>

          </form>
        </Card>
      )}

      {/* Mode 2: LOADING */}
      {mode === "loading" && (
        <Card style={{ padding: "4rem 2rem" }}>
          <Loader message={loaderMessage} />
        </Card>
      )}

      {/* Mode 3: RESULTS VIEW */}
      {mode === "results" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          <Card style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h3 style={{ color: "#fff", fontSize: "1.2rem", marginBottom: "0.25rem" }}>
                Analysis for: {title}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                Calculated {matchedPatents.length} matching prior art documents inside the system.
              </p>
            </div>
            
            <div style={{ display: "flex", gap: "1rem" }}>
              <Button variant="secondary" onClick={triggerSearchRefine}>
                Modify Parameters
              </Button>
              <Button variant="teal" onClick={handleExportPDF}>
                <FileText size={16} /> Generate 11-Section PDF Report
              </Button>
            </div>
          </Card>

          <AIAnalysis analysis={nlpAnalysis} />

          <NoveltyAnalysis novelty={noveltyAnalysis} />

          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: "1.5rem" }}>
            
            <div>
              <h3 style={{ color: "#fff", fontSize: "1.2rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Search size={18} style={{ color: "var(--accent-teal)" }} />
                Matching Prior Art Patents (Hybrid FAISS Vector Search)
              </h3>
              
              {matchedPatents.length === 0 ? (
                <Card style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                  <p>No conflicting prior art found exceeding search settings!</p>
                </Card>
              ) : (
                matchedPatents.map(patent => (
                  <PatentCard
                    key={patent.id}
                    patent={patent}
                    isSaved={savedPatentsIds.includes(patent.id)}
                    onToggleSave={handleToggleSavePatent}
                    onViewDetails={openDetails}
                    onCompare={openCompare}
                  />
                ))
              )}
            </div>

            <div>
              <h3 style={{ color: "#fff", fontSize: "1.2rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Sparkles size={18} style={{ color: "var(--accent-purple)" }} />
                AI Claims Refinement Copilot
              </h3>
              <ChatAssistant invention={{ title, description, domain, components, functions }} />
            </div>

          </div>

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

      {/* Side-by-side Compare modal popup */}
      <Modal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        title="Side-by-side Claim Matrix"
        footer={<Button onClick={() => setIsCompareOpen(false)}>Close Matrix</Button>}
      >
        <PatentComparison 
          invention={{ title, description, domain, components, functions }} 
          patent={comparePatent} 
        />
      </Modal>

      {/* MODULE 15: PDF Report Preview Modal */}
      <Modal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        title="AI Patent Search Report (11 Standardized Sections)"
        footer={
          <div style={{ display: "flex", gap: "1rem" }}>
            <Button variant="secondary" onClick={() => setIsReportOpen(false)}>Close</Button>
            <Button variant="teal" onClick={() => window.print()}>
              <Printer size={16} /> Print / Save as PDF
            </Button>
          </div>
        }
      >
        <PatentReportView 
          invention={{ title, description, domain, components, functions }}
          nlpAnalysis={nlpAnalysis}
          noveltyAnalysis={noveltyAnalysis}
          matchedPatents={matchedPatents}
        />
      </Modal>

    </div>
  );
}

export default InventionInput;
