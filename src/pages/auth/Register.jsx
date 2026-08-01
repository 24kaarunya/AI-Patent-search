import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Cpu, Eye, EyeOff } from "lucide-react";
import { authService } from "../../services/authService";
import { validateEmail, validatePassword } from "../../utils/validators";
import { Card } from "../../components/common/Card";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setErrors({});
    setApiError("");

    // Form inputs checks
    const newErrors = {};
    if (!name || name.trim().length < 2) newErrors.name = "Full name is required";
    
    const emailErr = validateEmail(email);
    if (emailErr) newErrors.email = emailErr;

    const passwordErr = validatePassword(password);
    if (passwordErr) newErrors.password = passwordErr;

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      authService.register(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setApiError(err.message || "Failed to create user account. Try another email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Card className="auth-card" style={{ maxWidth: "480px" }}>
        <div className="auth-header">
          <Cpu size={40} style={{ color: "var(--accent-teal)", marginBottom: "1rem" }} />
          <h2 className="auth-title">PATENT.AI</h2>
          <p className="auth-subtitle">Create Your Patent Research Account</p>
        </div>

        {apiError && (
          <div style={{ padding: "0.75rem 1rem", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "var(--radius-md)", color: "#fca5a5", fontSize: "0.85rem", marginBottom: "1.5rem", textAlign: "left" }}>
            {apiError}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <Input
            id="reg-name"
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            required
          />

          <Input
            id="reg-email"
            label="Email Address"
            type="email"
            placeholder="john.doe@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            required
          />

          <div style={{ position: "relative" }}>
            <Input
              id="reg-password"
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

          <Input
            id="reg-confirm-password"
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            required
          />

          <Button
            type="submit"
            variant="teal"
            disabled={loading}
            style={{ width: "100%", padding: "0.85rem", marginTop: "1rem" }}
          >
            {loading ? "Registering account..." : "Create Research Account"}
          </Button>
        </form>

        <p className="auth-redirect">
          Already have an account? <Link to="/login">Sign In Instead</Link>
        </p>
      </Card>
    </div>
  );
}

export default Register;
