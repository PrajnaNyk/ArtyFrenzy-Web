import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("af_token");
      const savedUser = localStorage.getItem("af_user");
      const savedExpiry = localStorage.getItem("af_expiry");
      
      // Check if 24 hours have passed
      const isExpired = savedExpiry ? new Date().getTime() > Number(savedExpiry) : true;

      if (isExpired) {
        localStorage.removeItem("af_token");
        localStorage.removeItem("af_user");
        localStorage.removeItem("af_expiry");
      }

      if (savedToken && savedUser && !isExpired) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      // If localStorage is corrupted, clear it so the app doesn't crash
      console.error("Error reading auth data, clearing storage:", error);
      localStorage.removeItem("af_token");
      localStorage.removeItem("af_user");
      localStorage.removeItem("af_expiry");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login(email, password);
    const { token, name, email: userEmail, role, id } = res.data;
    const userData = { id, name, email: userEmail, role };
    setUser(userData);
    localStorage.setItem("af_token", token);
    localStorage.setItem("af_user", JSON.stringify(userData));
    // Set expiry to 24 hours from now
    localStorage.setItem("af_expiry", String(new Date().getTime() + 24 * 60 * 60 * 1000));
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register(name, email, password);
    const { token, name: userName, email: userEmail, role, id } = res.data;
    const userData = { id, name: userName, email: userEmail, role };
    setUser(userData);
    localStorage.setItem("af_token", token);
    localStorage.setItem("af_user", JSON.stringify(userData));
    // Set expiry to 24 hours from now
    localStorage.setItem("af_expiry", String(new Date().getTime() + 24 * 60 * 60 * 1000));
    return userData;
  };

    const logout = () => {
    setUser(null);
    localStorage.removeItem("af_token");
    localStorage.removeItem("af_user");
    localStorage.removeItem("af_expiry");
    // REMOVED: localStorage.removeItem("af_cart");
    // REMOVED: localStorage.removeItem("af_wishlist");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoggedIn: !!user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}