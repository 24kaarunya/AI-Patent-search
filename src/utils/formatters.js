/**
 * Format raw date string into human-friendly format
 */
export function formatDate(dateString) {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? dateString : date.toLocaleDateString("en-US", options);
}

/**
 * Format raw IPC codes list or status string
 */
export function formatIpcCodes(ipcString) {
  if (!ipcString) return [];
  return ipcString.split(",").map(c => c.trim());
}

/**
 * Clean patent number display
 */
export function formatPatentNumber(number) {
  if (!number) return "";
  return number.toUpperCase();
}

/**
 * Split text into segment objects with match labels for keyword highlights (avoiding JSX in JS files)
 */
export function getHighlightedSegments(text, queryText) {
  if (!text) return [];
  if (!queryText) return [{ text, isMatch: false }];
  
  const words = queryText
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 2);
    
  if (words.length === 0) return [{ text, isMatch: false }];
  
  const escapedWords = words.map(w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
  const pattern = new RegExp(`\\b(${escapedWords.join("|")})\\b`, "gi");
  
  const parts = text.split(pattern);
  const matches = text.match(pattern) || [];
  
  let matchIndex = 0;
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      const match = matches[matchIndex++];
      return { text: match, isMatch: true };
    }
    return { text: part, isMatch: false };
  });
}
