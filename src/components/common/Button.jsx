import React from "react";

export function Button({
  type = "button",
  variant = "primary", // primary, secondary, teal, danger
  disabled = false,
  onClick,
  className = "",
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`btn btn-${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
