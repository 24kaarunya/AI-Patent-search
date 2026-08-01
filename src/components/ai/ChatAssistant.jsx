import React, { useState, useRef, useEffect } from "react";
import { Send, Cpu, Sparkles, AlertCircle } from "lucide-react";
import { aiService } from "../../services/aiService";

export function ChatAssistant({ invention }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "assistant",
      content: `Hello! I am your AI Patent Copilot. I've analyzed your invention draft for "${invention?.title || "your invention"}". 

You can ask me to:
- "Draft claims" for this invention.
- "Bypass suggestions" to avoid similar patents.
- "Recommend features" to increase the novelty score.
- "Critique my description" for patent drafting standards.`
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
    const userText = textToSend || inputText;
    if (!userText.trim()) return;

    if (!textToSend) setInputText("");
    
    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: "user",
      content: userMsgText(userText)
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // Call AI Chat suggestions
      const aiReply = await aiService.chatSuggest(invention, [...messages, userMsg]);
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: "assistant",
        content: aiReply
      }]);
    } catch (e) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: "assistant",
        content: "Oops! I encountered an issue analyzing the request. Please try again."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const userMsgText = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <div className="chat-container">
      {/* Messages */}
      <div className="chat-messages">
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={`chat-bubble chat-bubble-${msg.sender}`}
            style={{ whiteSpace: "pre-line" }}
          >
            {msg.content}
          </div>
        ))}
        {isTyping && (
          <div className="chat-bubble chat-bubble-assistant" style={{ padding: "0.5rem 1rem", display: "flex", gap: "0.25rem", alignItems: "center" }}>
            <span style={{ display: "inline-block", width: "6px", height: "6px", backgroundColor: "var(--text-secondary)", borderRadius: "50%", animation: "spin 1s infinite" }}></span>
            <span style={{ display: "inline-block", width: "6px", height: "6px", backgroundColor: "var(--text-secondary)", borderRadius: "50%", animation: "spin 1s infinite 0.2s" }}></span>
            <span style={{ display: "inline-block", width: "6px", height: "6px", backgroundColor: "var(--text-secondary)", borderRadius: "50%", animation: "spin 1s infinite 0.4s" }}></span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: "0.25rem" }}>Copilot is drafting...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts */}
      <div style={{ display: "flex", gap: "0.5rem", padding: "0.5rem", borderTop: "1px solid var(--border-color)", overflowX: "auto" }}>
        <button 
          type="button"
          onClick={() => handleSend("Draft patent claims")}
          disabled={isTyping}
          className="btn btn-secondary"
          style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem", borderRadius: "100px", whiteSpace: "nowrap" }}
        >
          <Cpu size={12} /> Draft Claims
        </button>
        <button 
          type="button"
          onClick={() => handleSend("Bypass suggestions")}
          disabled={isTyping}
          className="btn btn-secondary"
          style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem", borderRadius: "100px", whiteSpace: "nowrap" }}
        >
          <Sparkles size={12} /> Bypass Tips
        </button>
        <button 
          type="button"
          onClick={() => handleSend("Recommend features")}
          disabled={isTyping}
          className="btn btn-secondary"
          style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem", borderRadius: "100px", whiteSpace: "nowrap" }}
        >
          <AlertCircle size={12} /> Add Features
        </button>
      </div>

      {/* Chat Input */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="chat-input-area"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Copilot to refine your patent draft..."
          disabled={isTyping}
          style={{
            flex: 1,
            backgroundColor: "var(--bg-tertiary)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            color: "var(--text-primary)",
            padding: "0.6rem 1rem",
            fontSize: "0.85rem",
            outline: "none"
          }}
        />
        <button 
          type="submit" 
          disabled={isTyping || !inputText.trim()}
          className="btn btn-primary"
          style={{ padding: "0.6rem", borderRadius: "var(--radius-md)" }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

export default ChatAssistant;
