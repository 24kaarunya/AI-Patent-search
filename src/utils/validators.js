/**
 * Email validation regex
 */
export function validateEmail(email) {
  if (!email) return "Email is required";
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!re.test(email)) return "Invalid email address format";
  return null;
}

/**
 * Password strength rules:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export function validatePassword(password) {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters long";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Password must contain at least one special character";
  return null;
}

/**
 * Validate Invention Input Form
 */
export function validateInvention(title, description, domain, components, functions) {
  const errors = {};
  
  if (!title || title.trim().length < 5) {
    errors.title = "Title must be at least 5 characters long";
  } else if (title.trim().length > 100) {
    errors.title = "Title cannot exceed 100 characters";
  }
  
  if (!description || description.trim().split(/\s+/).filter(Boolean).length < 15) {
    errors.description = "Please describe the invention in more detail (minimum 15 words)";
  }
  
  if (!domain || domain === "") {
    errors.domain = "Please select a technology classification/domain";
  }
  
  if (!components || components.length === 0) {
    errors.components = "Add at least one core component/feature";
  }
  
  if (!functions || functions.length === 0) {
    errors.functions = "Add at least one core function or capability";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * XSS simple sanitizer to escape HTML entities
 */
export function sanitizeHTML(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}
