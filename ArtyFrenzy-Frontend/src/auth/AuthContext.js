import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("af_token");
    const savedUser = localStorage.getItem("af_user");
    if (savedToken && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData, jwtToken) => {
    setUser(userData);
    localStorage.setItem("af_token", jwtToken);
    localStorage.setItem("af_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("af_token");
    localStorage.removeItem("af_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}