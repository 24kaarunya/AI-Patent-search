import { searchService } from "./searchService";

export const patentService = {
  getPatents() {
    return searchService.getAllPatents();
  },
  
  getPatentById(id) {
    const all = searchService.getAllPatents();
    return all.find(p => p.id === id) || null;
  },
  
  savePatent(patent) {
    return searchService.savePatent(patent);
  },
  
  deletePatent(id) {
    return searchService.deletePatent(id);
  },
  
  resetDatabase() {
    return searchService.resetPatentsDatabase();
  }
};
export default patentService;
