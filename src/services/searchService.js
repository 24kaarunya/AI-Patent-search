const API_BASE = window.location.origin.includes("localhost:5173") ? "http://localhost:5000/api/invention" : "/api/invention";

export const searchService = {
  // Modular vector search
  async searchPatents(invention, thresholdScore = 15) {
    const token = localStorage.getItem("patent_assistant_session")
      ? JSON.parse(localStorage.getItem("patent_assistant_session")).token
      : "";
      
    try {
      const res = await fetch(`${API_BASE}/search-db`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          query: invention.title || invention.description,
          threshold: thresholdScore,
          domain: invention.domain
        })
      });
      
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.error("Failed to query vector search from backend:", e);
      return [];
    }
  },

  // Retrieve all patents in the database directly
  async getAllPatents() {
    const token = localStorage.getItem("patent_assistant_session")
      ? JSON.parse(localStorage.getItem("patent_assistant_session")).token
      : "";
      
    try {
      const res = await fetch(`${API_BASE}/patents`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.error("Failed to fetch patent collection:", e);
      return [];
    }
  },

  // Orchestrated analysis fetch (NLP + FAISS + Compare)
  async analyzeInventionFull(inventionObj, thresholdVal = 15) {
    const token = localStorage.getItem("patent_assistant_session")
      ? JSON.parse(localStorage.getItem("patent_assistant_session")).token
      : "";
      
    const res = await fetch(`${API_BASE}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        title: inventionObj.title,
        description: inventionObj.description,
        domain: inventionObj.domain,
        components: inventionObj.components,
        functions: inventionObj.functions,
        keywords: inventionObj.keywords
      })
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to analyze invention.");
    return data;
  },

  // History management
  async getSearchHistory(userEmail) {
    const token = localStorage.getItem("patent_assistant_session")
      ? JSON.parse(localStorage.getItem("patent_assistant_session")).token
      : "";
      
    try {
      const res = await fetch(`${API_BASE}/history`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async deleteSearchHistoryItem(userEmail, logId) {
    const token = localStorage.getItem("patent_assistant_session")
      ? JSON.parse(localStorage.getItem("patent_assistant_session")).token
      : "";
      
    try {
      await fetch(`${API_BASE}/history/${logId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
    } catch (e) {
      console.error(e);
    }
  },

  // Bookmark management
  async getSavedPatentIds(userEmail) {
    const token = localStorage.getItem("patent_assistant_session")
      ? JSON.parse(localStorage.getItem("patent_assistant_session")).token
      : "";
      
    try {
      const res = await fetch(`${API_BASE}/saved`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async getSavedPatents(userEmail) {
    try {
      const allPatents = await this.getAllPatents();
      const savedIds = await this.getSavedPatentIds(userEmail);
      return allPatents.filter(p => savedIds.includes(p.id));
    } catch (e) {
      return [];
    }
  },

  async toggleSavePatent(userEmail, patentId) {
    const token = localStorage.getItem("patent_assistant_session")
      ? JSON.parse(localStorage.getItem("patent_assistant_session")).token
      : "";
      
    try {
      const res = await fetch(`${API_BASE}/save-patent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ patentId })
      });
      const data = await res.json();
      return data.isSaved;
    } catch (e) {
      return false;
    }
  },

  async isPatentSaved(userEmail, patentId) {
    const list = await this.getSavedPatentIds(userEmail);
    return list.includes(patentId);
  },

  // Dynamic LLM comparison explanation
  async getExplanation(invention, patent) {
    const token = localStorage.getItem("patent_assistant_session")
      ? JSON.parse(localStorage.getItem("patent_assistant_session")).token
      : "";
      
    try {
      const res = await fetch(`${API_BASE}/explain`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ invention, patent })
      });
      if (!res.ok) return "Failed to generate AI explanation.";
      const data = await res.json();
      return data.explanation;
    } catch (e) {
      return "Failed to generate AI explanation.";
    }
  }
};
export default searchService;
