import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Cpu, User, LogOut, ChevronDown, Shield } from "lucide-react";
import { authService } from "../../services/authService";

export function Navbar() {
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(authService.getCurrentUser());
    };

    window.addEventListener("auth-change", handleAuthChange);
    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    setShowDropdown(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <Cpu className="logo-icon" size={24} />
        <span>PATENT.AI</span>
      </Link>

      <div className="nav-actions">
        {currentUser ? (
          <div className="profile-dropdown-container">
            <button 
              type="button" 
              className="nav-user-btn"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="avatar">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
              </div>
              <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>
                {currentUser.name}
              </span>
              <ChevronDown size={14} style={{ color: "var(--text-secondary)" }} />
            </button>

            {showDropdown && (
              <div className="profile-menu">
                <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border-color)" }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>
                    {currentUser.name}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    {currentUser.role === "Admin" && <Shield size={10} style={{ color: "var(--accent-teal)" }} />}
                    {currentUser.role} Account
                  </p>
                </div>
                
                <Link to="/profile" className="menu-item" onClick={() => setShowDropdown(false)}>
                  <User size={16} />
                  <span>My Profile</span>
                </Link>
                
                <div className="menu-item" onClick={handleLogout} style={{ borderTop: "1px solid var(--border-color)", color: "var(--accent-red)" }}>
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="btn btn-secondary" style={{ padding: "0.4rem 1.2rem", fontSize: "0.85rem" }}>
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
