import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedToken = sessionStorage.getItem("af_token");
      const savedUser = sessionStorage.getItem("af_user");
      const savedExpiry = sessionStorage.getItem("af_expiry");
      
      // Check if 24 hours have passed
      const isExpired = savedExpiry ? new Date().getTime() > Number(savedExpiry) : true;

      if (isExpired) {
        sessionStorage.removeItem("af_token");
        sessionStorage.removeItem("af_user");
        sessionStorage.removeItem("af_expiry");
      }

      if (savedToken && savedUser && !isExpired) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      // If sessionStorage is corrupted, clear it so the app doesn't crash
      console.error("Error reading auth data, clearing storage:", error);
      sessionStorage.removeItem("af_token");
      sessionStorage.removeItem("af_user");
      sessionStorage.removeItem("af_expiry");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login(email, password);
    const { token, name, email: userEmail, role, id } = res.data;
    const userData = { id, name, email: userEmail, role };
    setUser(userData);
   sessionStorage.setItem("af_token", token);
    sessionStorage.setItem("af_user", JSON.stringify(userData));
    // Set expiry to 24 hours from now
    sessionStorage.setItem("af_expiry", String(new Date().getTime() + 24 * 60 * 60 * 1000));
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register(name, email, password);
    const { token, name: userName, email: userEmail, role, id } = res.data;
    const userData = { id, name: userName, email: userEmail, role };
    setUser(userData);
    sessionStorage.setItem("af_token", token);
    sessionStorage.setItem("af_user", JSON.stringify(userData));
    // Set expiry to 24 hours from now
    sessionStorage.setItem("af_expiry", String(new Date().getTime() + 24 * 60 * 60 * 1000));
    return userData;
  };

    const logout = () => {
    setUser(null);
    sessionStorage.removeItem("af_token");
    sessionStorage.removeItem("af_user");
    sessionStorage.removeItem("af_expiry");
    // REMOVED: sessionStorage.removeItem("af_cart");
    // REMOVED: sessionStorage.removeItem("af_wishlist");
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