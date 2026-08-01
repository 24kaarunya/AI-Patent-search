import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Lightbulb, 
  Search, 
  Bookmark, 
  History, 
  TrendingUp, 
  GitCompare, 
  Shield, 
  Users, 
  Settings,
  FileText
} from "lucide-react";
import { authService } from "../../services/authService";

const navLink = ({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`;
const adminLink = ({ isActive }) => `sidebar-link admin-only ${isActive ? "active" : ""}`;

const SectionLabel = ({ icon, label }) => (
  <div style={{ margin: "1.5rem 0 0.4rem 0.75rem", fontSize: "0.68rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.3rem" }}>
    {icon}
    <span>{label}</span>
  </div>
);

export function Sidebar() {
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());

  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(authService.getCurrentUser());
    };
    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, []);

  if (!currentUser) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-nav">

        {/* === Layer 1: User === */}
        {currentUser.role !== "Admin" && (
          <>
            <SectionLabel icon={<Lightbulb size={10} style={{ color: "var(--accent-purple-mid)" }} />} label="Workspace" />

            <NavLink to="/dashboard" className={navLink}>
              <LayoutDashboard size={17} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/invention" className={navLink}>
              <Lightbulb size={17} />
              <span>Analyze Invention</span>
            </NavLink>

            <NavLink to="/search" className={navLink}>
              <Search size={17} />
              <span>Patent Search</span>
            </NavLink>

            <NavLink to="/workspace" className={navLink}>
              <GitCompare size={17} />
              <span>Research Workspace</span>
            </NavLink>

            {/* === Layer 4: Results & History === */}
            <SectionLabel icon={<FileText size={10} style={{ color: "var(--accent-teal)" }} />} label="My Library" />

            <NavLink to="/saved" className={navLink}>
              <Bookmark size={17} />
              <span>Saved Patents</span>
            </NavLink>

            <NavLink to="/history" className={navLink}>
              <History size={17} />
              <span>Search History</span>
            </NavLink>

            <NavLink to="/trends" className={navLink}>
              <TrendingUp size={17} />
              <span>Patent Trends</span>
            </NavLink>
          </>
        )}

        {/* === Layer 5: Admin === */}
        {currentUser.role === "Admin" && (
          <>
            <SectionLabel icon={<Shield size={10} style={{ color: "var(--accent-teal)" }} />} label="Admin Center" />

            <NavLink to="/admin" end className={adminLink}>
              <LayoutDashboard size={17} style={{ color: "var(--accent-teal)" }} />
              <span>Admin Dashboard</span>
            </NavLink>

            <NavLink to="/admin/users" className={adminLink}>
              <Users size={17} style={{ color: "var(--accent-teal)" }} />
              <span>User Management</span>
            </NavLink>
          </>
        )}
      </div>

      <div className="sidebar-footer">
        <NavLink to="/settings" className={navLink} style={{ marginBottom: "0.5rem" }}>
          <Settings size={17} />
          <span>Settings</span>
        </NavLink>
        <p>PATENT.AI v1.0.0</p>
      </div>
    </aside>
  );
}

export default Sidebar;
