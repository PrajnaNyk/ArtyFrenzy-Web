import { useState } from "react";
import { useAuth } from "./AuthContext";
import "./Auth.css";

export default function RegisterPage({ onSwitchToLogin, onClose }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const getStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getStrength(form.password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#E24B4A", "#EF9F27", "#1D9E75", "#0F6E56"][strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      // Replace with real API call when backend is ready:
      // const res = await fetch("http://localhost:8080/api/auth/register", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      // });
      // const data = await res.json();
      // if (!res.ok) throw new Error(data.message || "Registration failed");
      // login({ name: data.name, email: data.email }, data.token);

      // Demo register (remove when backend is ready)
      await new Promise((r) => setTimeout(r, 1200));
      login({ name: form.name, email: form.email }, "demo-jwt-token-456");
      onClose && onClose();
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left auth-left-reg">
        <div className="auth-art-stack">
          <div className="auth-art auth-art-1">
            <img src="https://images.unsplash.com/photo-1549887534-1541e9326642?w=400&q=80" alt="" />
          </div>
          <div className="auth-art auth-art-2">
            <img src="https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=400&q=80" alt="" />
          </div>
          <div className="auth-art auth-art-3">
            <img src="https://images.unsplash.com/photo-1576020799627-aeac74d58064?w=400&q=80" alt="" />
          </div>
        </div>
        <div className="auth-left-content">
          <div className="auth-logo">
            <span className="auth-logo-star">✦</span>
            <span className="auth-logo-text">ArtyFrenzy</span>
          </div>
          <p className="auth-left-quote">"Art is not what you see, but what you make others see."</p>
          <p className="auth-left-author">— Edgar Degas</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap">
          <div className="auth-form-header">
            <p className="auth-eyebrow">✦ Join ArtyFrenzy</p>
            <h2 className="auth-title">Start your art<br />journey today</h2>
            <p className="auth-sub">Already have an account?{" "}
              <button className="auth-switch-btn" onClick={onSwitchToLogin}>
                Sign in
              </button>
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}

            <div className="auth-field">
              <label className="auth-label">Full name</label>
              <input
                className="auth-input"
                type="text"
                name="name"
                placeholder="Priya Sharma"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Email address</label>
              <input
                className="auth-input"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <input
                  className="auth-input"
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="auth-toggle-pass"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
              {form.password && (
                <div className="strength-wrap">
                  <div className="strength-bar">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="strength-seg"
                        style={{ background: i <= strength ? strengthColor : "rgba(44,40,37,0.1)" }}
                      />
                    ))}
                  </div>
                  <span className="strength-label" style={{ color: strengthColor }}>
                    {strengthLabel}
                  </span>
                </div>
              )}
            </div>

            <div className="auth-field">
              <label className="auth-label">Confirm password</label>
              <input
                className="auth-input"
                type={showPass ? "text" : "password"}
                name="confirm"
                placeholder="Re-enter your password"
                value={form.confirm}
                onChange={handleChange}
                autoComplete="new-password"
              />
              {form.confirm && form.password !== form.confirm && (
                <p className="auth-field-error">Passwords do not match</p>
              )}
            </div>

            <p className="auth-terms">
              By creating an account, you agree to our{" "}
              <span className="auth-link">Terms of Service</span> and{" "}
              <span className="auth-link">Privacy Policy</span>.
            </p>

            <button className="auth-submit-btn" type="submit" disabled={loading}>
              {loading ? <span className="auth-spinner" /> : "Create account"}
            </button>

            <div className="auth-divider"><span>or sign up with</span></div>

            <div className="auth-social-btns">
              <button type="button" className="auth-social-btn">
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>
              <button type="button" className="auth-social-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                GitHub
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}