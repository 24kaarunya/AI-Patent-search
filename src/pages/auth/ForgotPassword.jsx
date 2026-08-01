import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Cpu, CheckCircle } from "lucide-react";
import { authService } from "../../services/authService";
import { validateEmail, validatePassword } from "../../utils/validators";
import { Card } from "../../components/common/Card";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = (e) => {
    e.preventDefault();
    setErrors({});
    setApiError("");

    const newErrors = {};
    const emailErr = validateEmail(email);
    if (emailErr) newErrors.email = emailErr;

    const passwordErr = validatePassword(newPassword);
    if (passwordErr) newErrors.newPassword = passwordErr;

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      authService.resetPassword(email, newPassword);
      setSuccess(true);
    } catch (err) {
      setApiError(err.message || "Failed to locate account under this email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <div className="auth-header">
          <Cpu size={40} style={{ color: "var(--accent-purple)", marginBottom: "1rem" }} />
          <h2 className="auth-title">PATENT.AI</h2>
          <p className="auth-subtitle">Recovery & Password Reset Gate</p>
        </div>

        {success ? (
          <div className="fade-in" style={{ textAlign: "center" }}>
            <CheckCircle size={48} style={{ color: "var(--accent-green)", marginBottom: "1rem" }} />
            <h3 style={{ color: "#fff", marginBottom: "0.5rem" }}>Password Reset Complete</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              Your account password has been successfully updated. You may now return to the portal to sign in.
            </p>
            <Link to="/login" className="btn btn-primary" style={{ width: "100%" }}>
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset}>
            {apiError && (
              <div style={{ padding: "0.75rem 1rem", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "var(--radius-md)", color: "#fca5a5", fontSize: "0.85rem", marginBottom: "1.5rem", textAlign: "left" }}>
                {apiError}
              </div>
            )}

            <Input
              id="reset-email"
              label="Account Email Address"
              type="email"
              placeholder="user@patentai.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
            />

            <Input
              id="reset-new-password"
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={errors.newPassword}
              required
            />

            <Input
              id="reset-confirm-password"
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              required
            />

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              style={{ width: "100%", padding: "0.85rem", marginTop: "1rem" }}
            >
              {loading ? "Updating credentials..." : "Reset Account Credentials"}
            </Button>

            <p className="auth-redirect" style={{ marginTop: "1.5rem" }}>
              <Link to="/login" style={{ color: "var(--text-secondary)" }}>Back to Login</Link>
            </p>
          </form>
        )}
      </Card>
    </div>
  );
}

export default ForgotPassword;
