import { useState } from "react";
import { useAuth } from "./AuthContext";
import "./Auth.css";

export default function RegisterPage({ onSwitchToLogin, onClose }) {
  const { register } = useAuth(); // <-- Use register instead of login
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const getStrength = (p) => {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
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
      // Call the real register function from AuthContext
      await register(form.name, form.email, form.password);
      onClose(); // New users are usually 'USER' role, so just close modal
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ... (Keep the rest of the return statement exactly the same as your original file)
  return (
    <div className="auth-page">
      {/* ... identical JSX ... */}
    </div>
  );
}