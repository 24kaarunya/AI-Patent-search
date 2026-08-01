import React from "react";

export function Footer() {
  return (
    <footer className="footer">
      <p>
        &copy; {new Date().getFullYear()} PATENT.AI - Secure Prior-Art Intelligence Engine. 
        Developed as an AI Research Assistant. Not a substitute for legal counsel.
      </p>
    </footer>
  );
}

export default Footer;
