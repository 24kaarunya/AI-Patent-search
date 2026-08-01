import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Cpu, Shield, User, Eye, EyeOff } from "lucide-react";
import { authService } from "../../services/authService";
import { validateEmail } from "../../utils/validators";
import { Card } from "../../components/common/Card";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    setApiError("");

    // Prior validation
    const emailErr = validateEmail(email);
    const newErrors = {};
    if (emailErr) newErrors.email = emailErr;
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const user = await authService.login(email, password);
      if (user && user.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setApiError(err.message || "Invalid credentials. Please verify your email and password.");
    } finally {
      setLoading(false);
    }
  };

  const fillAdmin = () => {
    setEmail("admin@patentai.com");
    setPassword("Admin@123");
    setErrors({});
    setApiError("");
  };

  const fillUser = () => {
    setEmail("user@patentai.com");
    setPassword("User@1234");
    setErrors({});
    setApiError("");
  };

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <div className="auth-header">
          <Cpu size={40} style={{ color: "var(--accent-purple)", marginBottom: "1rem" }} />
          <h2 className="auth-title">PATENT.AI</h2>
          <p className="auth-subtitle">AI-Powered Prior-Art Discovery System</p>
        </div>

        {/* Quick Credentials Panel */}
        <div style={{ padding: "1rem", background: "rgba(139, 92, 246, 0.05)", border: "1px solid var(--border-glow)", borderRadius: "var(--radius-md)", marginBottom: "1.5rem", textAlign: "left" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent-purple)", display: "block", marginBottom: "0.5rem" }}>
            🔑 Default Demo Login Credentials:
          </span>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={fillAdmin}
              className="btn btn-secondary"
              style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem", borderRadius: "100px" }}
            >
              <Shield size={12} style={{ color: "var(--accent-teal)" }} />
              Fill Admin (admin@patentai.com)
            </button>
            <button
              type="button"
              onClick={fillUser}
              className="btn btn-secondary"
              style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem", borderRadius: "100px" }}
            >
              <User size={12} style={{ color: "var(--accent-purple)" }} />
              Fill Researcher (user@patentai.com)
            </button>
          </div>
        </div>

        {apiError && (
          <div style={{ padding: "0.75rem 1rem", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "var(--radius-md)", color: "#fca5a5", fontSize: "0.85rem", marginBottom: "1.5rem", textAlign: "left" }}>
            {apiError}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <Input
            id="login-email"
            label="Email Address"
            type="email"
            placeholder="Enter your email (e.g. user@patentai.com)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            required
          />

          <div style={{ position: "relative" }}>
            <Input
              id="login-password"
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "12px",
                top: "38px",
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer"
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div style={{ textAlign: "right", marginBottom: "1.5rem" }}>
            <Link to="/forgot-password" style={{ color: "var(--text-secondary)", fontSize: "0.8rem", textDecoration: "none" }}>
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            style={{ width: "100%", padding: "0.85rem" }}
          >
            {loading ? "Authenticating session..." : "Sign In to Workspace"}
          </Button>
        </form>

        <p className="auth-redirect">
          Don't have an account? <Link to="/register">Register Here</Link>
        </p>
      </Card>
    </div>
  );
}

export default Login;
