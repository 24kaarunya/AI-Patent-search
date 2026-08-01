import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, Users, Award, Clock, ArrowRight, UserCheck, UserX, Search } from "lucide-react";
import { authService } from "../../services/authService";
import { searchService } from "../../services/searchService";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { formatDate } from "../../utils/formatters";

export function AdminDashboard() {
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const users = await authService.getAllUsers();
        const withStats = await Promise.all(users.map(async u => {
          let historyList = [];
          try {
            historyList = await searchService.getSearchHistory(u.email);
          } catch (e) {
            historyList = [];
          }
          return {
            ...u,
            searchCount: historyList.length,
            status: u.status || "Active"
          };
        }));
        setAllUsers(withStats);
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      }
    }
    loadData();
  }, []);

  const regularUsers = allUsers.filter(u => u.role !== "Admin");
  const totalUsers = regularUsers.length;
  const activeCount = regularUsers.filter(u => u.status === "Active").length;
  const inactiveCount = regularUsers.filter(u => u.status === "Inactive").length;
  const adminCount = allUsers.filter(u => u.role === "Admin").length;

  const stats = [
    { label: "Total Registered Users", value: totalUsers, icon: <Users size={20} />, color: "var(--accent-purple-mid)" },
    { label: "Active Users", value: activeCount, icon: <UserCheck size={20} />, color: "var(--accent-green)" },
    { label: "Suspended Users", value: inactiveCount, icon: <UserX size={20} />, color: "var(--accent-rose)" },
    { label: "System Administrators", value: adminCount, icon: <Award size={20} />, color: "var(--accent-teal)" }
  ];

  return (
    <div className="fade-in" style={{ textAlign: "left" }}>
      
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.75rem", color: "#fff", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Shield size={24} style={{ color: "var(--accent-teal)" }} /> Admin User Control Center
        </h2>
        <p style={{ color: "var(--text-secondary)", marginTop: "0.25rem" }}>
          Manage user authentication credentials, system roles, and account access status configurations.
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
        {stats.map((s, i) => (
          <Card key={i} style={{ padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</span>
              <h3 style={{ fontSize: "1.75rem", color: "#fff", marginTop: "0.2rem" }}>{s.value}</h3>
            </div>
            <div style={{ background: "rgba(255,255,255,0.025)", padding: "0.5rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", color: s.color }}>
              {s.icon}
            </div>
          </Card>
        ))}
      </div>

      {/* Main Admin Portal Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
        
        {/* User Management Quick Action Portal */}
        <Card style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ color: "#fff", fontSize: "1.1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.65rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Users size={18} style={{ color: "var(--accent-purple-mid)" }} />
              Quick Actions Portal
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: "1.5" }}>
              Access user search filters, modify account credentials, assign Admin credentials, and inspect security logs.
            </p>
          </div>
          <Link to="/admin/users" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "fit-content", textDecoration: "none" }}>
            Open User Management Sub-Module <ArrowRight size={14} />
          </Link>
        </Card>

        {/* Security Access Rules Status */}
        <Card>
          <h3 style={{ color: "#fff", fontSize: "1.1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.65rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Shield size={18} style={{ color: "var(--accent-teal)" }} />
            Security & Authentication Policy
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { rule: "Password Hashing Algorithm", status: "SHA-256 / PBKDF2" },
              { rule: "Authentication Mechanism", status: "JSON Web Tokens (JWT)" },
              { rule: "User Session Timeout", status: "24 Hours Enforced" },
              { rule: "Access Role Definitions", status: "Admin, Standard User" }
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.01)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", fontSize: "0.8rem" }}>
                <span style={{ color: "var(--text-secondary)" }}>{r.rule}</span>
                <Badge variant="teal">{r.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* Recently Registered Accounts */}
      <Card>
        <h3 style={{ color: "#fff", fontSize: "1.1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.65rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Clock size={18} style={{ color: "var(--accent-teal)" }} />
          Recently Registered Accounts
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <th style={{ padding: "0.5rem 0.75rem", textAlign: "left" }}>Name</th>
                <th style={{ padding: "0.5rem 0.75rem", textAlign: "left" }}>Email</th>
                <th style={{ padding: "0.5rem 0.75rem", textAlign: "left" }}>Assigned Role</th>
                <th style={{ padding: "0.5rem 0.75rem", textAlign: "left" }}>Status</th>
                <th style={{ padding: "0.5rem 0.75rem", textAlign: "left" }}>Registration Date</th>
              </tr>
            </thead>
            <tbody>
              {regularUsers.slice(0, 5).map(u => (
                <tr key={u.email} style={{ borderBottom: "1px solid var(--border-color-soft)" }}>
                  <td style={{ padding: "0.6rem 0.75rem", fontWeight: 600, color: "#fff" }}>{u.name}</td>
                  <td style={{ padding: "0.6rem 0.75rem", color: "var(--text-secondary)", fontFamily: "monospace" }}>{u.email}</td>
                  <td style={{ padding: "0.6rem 0.75rem" }}>
                    <Badge variant={u.role === "Admin" ? "teal" : "purple"}>{u.role}</Badge>
                  </td>
                  <td style={{ padding: "0.6rem 0.75rem" }}>
                    <Badge variant={u.status === "Active" ? "green" : "red"}>{u.status}</Badge>
                  </td>
                  <td style={{ padding: "0.6rem 0.75rem", color: "var(--text-muted)" }}>{formatDate(u.created)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}

export default AdminDashboard;
