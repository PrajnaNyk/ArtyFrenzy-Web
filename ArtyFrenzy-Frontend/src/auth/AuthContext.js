import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("af_token");
    const savedUser = localStorage.getItem("af_user");
    if (savedToken && savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login(email, password);
    const { token, name, email: userEmail, role, id } = res.data;
    const userData = { id, name, email: userEmail, role };
    setUser(userData);
    localStorage.setItem("af_token", token);
    localStorage.setItem("af_user", JSON.stringify(userData));
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register(name, email, password);
    const { token, name: userName, email: userEmail, role, id } = res.data;
    const userData = { id, name: userName, email: userEmail, role };
    setUser(userData);
    localStorage.setItem("af_token", token);
    localStorage.setItem("af_user", JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("af_token");
    localStorage.removeItem("af_user");
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