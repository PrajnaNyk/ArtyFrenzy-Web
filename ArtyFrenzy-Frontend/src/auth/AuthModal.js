import { useState } from "react";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import "./Auth.css";

export default function AuthModal({ mode, onClose }) {
  const [authMode, setAuthMode] = useState(mode);

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-box" onClick={e => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>✕</button>
        {authMode === "login" ? (
          <LoginPage
            onSwitchToRegister={() => setAuthMode("register")}
            onClose={onClose}
          />
        ) : (
          <RegisterPage
            onSwitchToLogin={() => setAuthMode("login")}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}