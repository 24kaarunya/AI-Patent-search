import React, { useState } from "react";
import { User, Calendar, Shield, Save, Check } from "lucide-react";
import { authService } from "../../services/authService";
import { Card } from "../../components/common/Card";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { formatDate } from "../../utils/formatters";

export function UserProfile() {
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [name, setName] = useState(currentUser?.name || "");
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = (e) => {
    e.preventDefault();
    setSuccess(false);
    setError("");

    if (!name.trim()) {
      setError("Name field cannot be left blank.");
      return;
    }

    try {
      const updated = authService.updateProfile(name, bio);
      setCurrentUser(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    }
  };

  if (!currentUser) return <p>Unauthorized access. Please login.</p>;

  return (
    <div className="fade-in" style={{ textAlign: "left", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "1.75rem", marginBottom: "1.5rem" }}>User Profile Workspace</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* User Card Shell */}
        <Card style={{ display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap" }}>
          <div className="avatar" style={{ width: "80px", height: "80px", fontSize: "2.5rem" }}>
            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h3 style={{ color: "#fff", fontSize: "1.4rem", marginBottom: "0.25rem" }}>{currentUser.name}</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "0.5rem" }}>{currentUser.email}</p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", padding: "0.25rem 0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)", borderRadius: "100px", fontSize: "0.8rem", color: "var(--text-primary)" }}>
                <Shield size={12} style={{ color: "var(--accent-purple)" }} />
                {currentUser.role} Account
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", padding: "0.25rem 0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)", borderRadius: "100px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                <Calendar size={12} />
                Joined: {formatDate(currentUser.created)}
              </span>
            </div>
          </div>
        </Card>

        {/* Profile Edit Panel */}
        <Card>
          <h4 style={{ color: "#fff", fontSize: "1.1rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
            Edit Account Profile Details
          </h4>

          {success && (
            <div style={{ padding: "0.75rem 1rem", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "var(--radius-md)", color: "#34d399", fontSize: "0.85rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Check size={16} /> Profile updated successfully!
            </div>
          )}

          {error && (
            <div style={{ padding: "0.75rem 1rem", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "var(--radius-md)", color: "#fca5a5", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleUpdate}>
            <Input
              id="prof-name"
              label="Full Display Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              id="prof-bio"
              label="Professional Biography / Research Focus"
              isTextArea
              rows={4}
              placeholder="e.g. Senior researcher at SolarVolt focusing on double axis trackers and efficiency panels."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="submit" variant="primary">
                <Save size={16} /> Save Changes
              </Button>
            </div>
          </form>
        </Card>

      </div>
    </div>
  );
}

export default UserProfile;
