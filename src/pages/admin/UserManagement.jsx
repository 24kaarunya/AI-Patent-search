import React, { useState, useEffect } from "react";
import {
  Users, Shield, User, Award, Check, Search, Trash2,
  UserX, UserCheck, Eye, Mail, Calendar, ChevronDown
} from "lucide-react";
import { authService } from "../../services/authService";
import { searchService } from "../../services/searchService";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { formatDate } from "../../utils/formatters";

export function UserManagement() {
  const [activeAdminUser] = useState(() => authService.getCurrentUser());
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = () => {
    const raw = authService.getAllUsers();
    // Exclude Admins from the registered users list
    const regularUsers = raw.filter(u => u.role !== "Admin");
    const withStats = regularUsers.map(u => ({
      ...u,
      searchCount: searchService.getSearchHistory(u.email).length,
      status: u.status || "Active",
    }));
    setUsers(withStats);
  };

  const flash = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleToggleRole = (email, currentRole) => {
    if (activeAdminUser && email.toLowerCase() === activeAdminUser.email.toLowerCase()) {
      alert("Cannot change your own role while logged in.");
      return;
    }
    const nextRole = currentRole === "Admin" ? "User" : "Admin";
    if (window.confirm(`Change role for ${email} to ${nextRole}?`)) {
      authService.updateUserRole(email, nextRole);
      flash(`Role for ${email} updated to ${nextRole}.`);
      loadUsers();
    }
  };

  const handleToggleStatus = (email, currentStatus) => {
    if (activeAdminUser && email.toLowerCase() === activeAdminUser.email.toLowerCase()) {
      alert("Cannot deactivate your own account.");
      return;
    }
    const nextStatus = currentStatus === "Active" ? "Inactive" : "Active";
    // Update status in storage via a simple patch
    const raw = JSON.parse(localStorage.getItem("patent_assistant_users") || "[]");
    const idx = raw.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (idx !== -1) {
      raw[idx].status = nextStatus;
      localStorage.setItem("patent_assistant_users", JSON.stringify(raw));
    }
    flash(`Account ${email} ${nextStatus === "Active" ? "activated" : "deactivated"}.`);
    loadUsers();
  };

  const handleDelete = (email) => {
    if (activeAdminUser && email.toLowerCase() === activeAdminUser.email.toLowerCase()) {
      alert("Cannot delete your own admin account.");
      return;
    }
    if (window.confirm(`Permanently delete account for ${email}? This cannot be undone.`)) {
      const raw = JSON.parse(localStorage.getItem("patent_assistant_users") || "[]");
      const filtered = raw.filter(u => u.email.toLowerCase() !== email.toLowerCase());
      localStorage.setItem("patent_assistant_users", JSON.stringify(filtered));
      flash(`User ${email} deleted.`);
      loadUsers();
    }
  };

  const filtered = users.filter(u => {
    const matchQ = !query || u.name?.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase());
    const matchRole = filterRole === "All" || u.role === filterRole;
    const matchStatus = filterStatus === "All" || (u.status || "Active") === filterStatus;
    return matchQ && matchRole && matchStatus;
  });

  return (
    <div className="fade-in" style={{ textAlign: "left" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.75rem", color: "#fff", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Users size={24} style={{ color: "var(--accent-teal)" }} /> User Management
        </h2>
        <p style={{ color: "var(--text-secondary)" }}>
          View, search, activate/deactivate, assign roles, and manage all registered user accounts.
        </p>
      </div>

      {/* Summary Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Total Users", value: users.length, color: "var(--accent-purple-mid)" },
          { label: "Active", value: users.filter(u => (u.status || "Active") === "Active").length, color: "var(--accent-green)" },
          { label: "Inactive", value: users.filter(u => u.status === "Inactive").length, color: "var(--accent-rose)" },
          { label: "System Admins", value: authService.getAllUsers().filter(u => u.role === "Admin").length, color: "var(--accent-teal)" },
        ].map((s, i) => (
          <Card key={i} style={{ padding: "0.85rem", textAlign: "center" }}>
            <strong style={{ fontSize: "1.5rem", color: s.color, display: "block" }}>{s.value}</strong>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>{s.label}</span>
          </Card>
        ))}
      </div>

      {successMsg && (
        <div style={{ padding: "0.7rem 1rem", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "var(--radius-md)", color: "#34d399", fontSize: "0.85rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Check size={14} /> {successMsg}
        </div>
      )}

      {/* Filter Bar */}
      <Card style={{ marginBottom: "1.25rem", padding: "1rem" }}>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
            <Search size={14} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              className="form-control"
              placeholder="Search by name or email..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ paddingLeft: "2.25rem" }}
            />
          </div>
          <select className="form-control" style={{ width: "140px" }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                {["User", "Email", "Role", "Searches", "Status", "Registered", "Actions"].map(h => (
                  <th key={h} style={{ padding: "0.6rem 0.75rem", textAlign: "left", color: "var(--text-muted)", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.email} style={{ borderBottom: "1px solid var(--border-color-soft)", opacity: u.status === "Inactive" ? 0.6 : 1 }}>
                  <td style={{ padding: "0.7rem 0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div className="avatar" style={{ width: "28px", height: "28px", fontSize: "0.75rem", flexShrink: 0 }}>
                        {u.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <span style={{ fontWeight: 600, color: "#fff" }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "0.7rem 0.75rem", color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>{u.email}</td>
                  <td style={{ padding: "0.7rem 0.75rem" }}>
                    <Badge variant={u.role === "Admin" ? "teal" : "purple"}>{u.role}</Badge>
                  </td>
                  <td style={{ padding: "0.7rem 0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>{u.searchCount}</td>
                  <td style={{ padding: "0.7rem 0.75rem" }}>
                    <Badge variant={(u.status || "Active") === "Active" ? "green" : "red"}>{u.status || "Active"}</Badge>
                  </td>
                  <td style={{ padding: "0.7rem 0.75rem", color: "var(--text-muted)", fontSize: "0.78rem" }}>{formatDate(u.created)}</td>
                  <td style={{ padding: "0.7rem 0.75rem" }}>
                    <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                      <button type="button" title="Toggle Role" onClick={() => handleToggleRole(u.email, u.role)}
                        className="btn btn-secondary"
                        style={{ padding: "0.3rem 0.55rem", fontSize: "0.72rem", display: "flex", alignItems: "center", gap: "0.25rem" }}
                        disabled={activeAdminUser?.email?.toLowerCase() === u.email.toLowerCase()}>
                        <Award size={11} />
                        {u.role === "Admin" ? "Demote" : "Promote"}
                      </button>
                      <button type="button" title="Toggle Status" onClick={() => handleToggleStatus(u.email, u.status || "Active")}
                        className="btn btn-secondary"
                        style={{ padding: "0.3rem 0.55rem", fontSize: "0.72rem", display: "flex", alignItems: "center", gap: "0.25rem" }}
                        disabled={activeAdminUser?.email?.toLowerCase() === u.email.toLowerCase()}>
                        {(u.status || "Active") === "Active" ? <UserX size={11} /> : <UserCheck size={11} />}
                        {(u.status || "Active") === "Active" ? "Deactivate" : "Activate"}
                      </button>
                      <button type="button" title="Delete User" onClick={() => handleDelete(u.email)}
                        style={{ background: "none", border: "1px solid rgba(244,63,94,0.3)", color: "var(--accent-rose)", borderRadius: "var(--radius-sm)", cursor: "pointer", padding: "0.3rem 0.5rem", fontSize: "0.72rem", display: "flex", alignItems: "center", gap: "0.25rem" }}
                        disabled={activeAdminUser?.email?.toLowerCase() === u.email.toLowerCase()}>
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>No users match your search.</div>
        )}
      </Card>
    </div>
  );
}

export default UserManagement;
