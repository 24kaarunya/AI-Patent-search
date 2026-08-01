import React from "react";

export function Badge({ variant = "purple", children }) {
  // Variants: purple, teal, green, red, amber
  return (
    <span className={`badge badge-${variant}`}>
      {children}
    </span>
  );
}

export default Badge;
