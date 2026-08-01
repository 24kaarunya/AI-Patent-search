import { initialPatents } from "../data/patentData";
import { calculateOverallSimilarity, generateDenseEmbedding } from "../utils/similarity";

const CUSTOM_PATENTS_KEY = "patent_assistant_custom_patents";
const SEARCH_HISTORY_KEY = "patent_assistant_search_history";
const SAVED_PATENTS_KEY = "patent_assistant_saved_patents";

function getActivePatents() {
  const customPatents = localStorage.getItem(CUSTOM_PATENTS_KEY);
  if (!customPatents) {
    localStorage.setItem(CUSTOM_PATENTS_KEY, JSON.stringify(initialPatents));
    return initialPatents;
  }
  return JSON.parse(customPatents);
}

export const searchService = {
  /**
   * MODULE 7: Hybrid Vector + Keyword Semantic Search (ChromaDB / FAISS simulation)
   */
  searchPatents(invention, thresholdScore = 15) {
    const allPatents = getActivePatents();
    
    // Generate invention embedding snippet for inspector
    const invText = `${invention.title} ${invention.description}`;
    const invVector = generateDenseEmbedding(invText);
    const vectorSnippet = `[${invVector.slice(0, 4).join(", ")}, ...] (384-dim Sentence Transformer)`;

    const results = allPatents.map(patent => {
      const similarityResult = calculateOverallSimilarity(invention, patent);
      return {
        ...patent,
        similarity: similarityResult
      };
    });
    
    const matched = results
      .filter(p => p.similarity.overallScore >= thresholdScore)
      .sort((a, b) => b.similarity.overallScore - a.similarity.overallScore);

    return matched;
  },

  getAllPatents() {
    return getActivePatents();
  },

  savePatent(newPatent) {
    const patents = getActivePatents();
    const existingIdx = patents.findIndex(p => p.patentNumber === newPatent.patentNumber);
    
    if (existingIdx !== -1) {
      patents[existingIdx] = { ...patents[existingIdx], ...newPatent };
    } else {
      const generatedId = `pat-${Date.now()}`;
      patents.push({ id: generatedId, ...newPatent });
    }
    
    localStorage.setItem(CUSTOM_PATENTS_KEY, JSON.stringify(patents));
    return true;
  },

  deletePatent(patentId) {
    const patents = getActivePatents();
    const filtered = patents.filter(p => p.id !== patentId);
    localStorage.setItem(CUSTOM_PATENTS_KEY, JSON.stringify(filtered));
    return true;
  },

  resetPatentsDatabase() {
    localStorage.setItem(CUSTOM_PATENTS_KEY, JSON.stringify(initialPatents));
    return true;
  },

  /**
   * MODULE 14: Search History Archives (with individual item deletion & re-run support)
   */
  getSearchHistory(userEmail) {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (!history) return [];
    
    const allLogs = JSON.parse(history);
    return allLogs.filter(log => log.userEmail === userEmail).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  addSearchHistory(userEmail, invention, matchCount, topScore, userName = "") {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY) ? JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY)) : [];
    
    const logEntry = {
      id: `log-${Date.now()}`,
      userEmail,
      userName,
      title: invention.title,
      description: invention.description,
      domain: invention.domain,
      components: invention.components,
      functions: invention.functions,
      keywords: invention.keywords || [],
      matchCount,
      topScore,
      timestamp: new Date().toISOString()
    };
    
    history.push(logEntry);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
    return logEntry;
  },

  deleteSearchHistoryItem(userEmail, logId) {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (!history) return;
    
    const allLogs = JSON.parse(history);
    const filtered = allLogs.filter(log => !(log.userEmail === userEmail && log.id === logId));
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(filtered));
  },

  clearSearchHistory(userEmail) {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (!history) return;
    
    const allLogs = JSON.parse(history);
    const filtered = allLogs.filter(log => log.userEmail !== userEmail);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(filtered));
  },

  getSavedPatents(userEmail) {
    const saved = localStorage.getItem(SAVED_PATENTS_KEY);
    if (!saved) return [];
    
    const allSaved = JSON.parse(saved);
    const userSavedIds = allSaved[userEmail] || [];
    
    const patents = getActivePatents();
    return patents.filter(p => userSavedIds.includes(p.id));
  },

  toggleSavePatent(userEmail, patentId) {
    const savedStr = localStorage.getItem(SAVED_PATENTS_KEY);
    const allSaved = savedStr ? JSON.parse(savedStr) : {};
    
    if (!allSaved[userEmail]) {
      allSaved[userEmail] = [];
    }
    
    const idx = allSaved[userEmail].indexOf(patentId);
    let isSaved = false;
    
    if (idx !== -1) {
      allSaved[userEmail].splice(idx, 1);
    } else {
      allSaved[userEmail].push(patentId);
      isSaved = true;
    }
    
    localStorage.setItem(SAVED_PATENTS_KEY, JSON.stringify(allSaved));
    return isSaved;
  },

  isPatentSaved(userEmail, patentId) {
    const savedStr = localStorage.getItem(SAVED_PATENTS_KEY);
    if (!savedStr) return false;
    
    const allSaved = JSON.parse(savedStr);
    const userSavedIds = allSaved[userEmail] || [];
    return userSavedIds.includes(patentId);
  }
};
