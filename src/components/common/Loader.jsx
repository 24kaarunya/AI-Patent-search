import React from "react";

export function Loader({ message = "Analyzing description using NLP models..." }) {
  return (
    <div className="spinner-container fade-in">
      <div className="spinner"></div>
      <p style={{ fontWeight: 600, color: "var(--accent-teal)" }}>{message}</p>
    </div>
  );
}

export default Loader;
