import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import AdminLayout from "./AdminLayout";
import AdminDashboard from "./AdminDashboard";
import AdminArtworks from "./AdminArtworks";
import AdminArtists from "./AdminArtists";   
import AdminOrders from "./AdminOrders";     
import AdminUsers from "./AdminUsers";       

export default function AdminApp() {
  const { user, isLoggedIn } = useAuth();
  const [activePage, setActivePage] = useState("dashboard");

  // Protect admin route
  if (!isLoggedIn || user?.role !== "ADMIN") {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", height: "100vh", gap: "16px",
        fontFamily: "'DM Sans', sans-serif", background: "#F4F2EE"
      }}>
        <span style={{ fontSize: "48px" }}>🔐</span>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 300 }}>
          Admin Access Only
        </h2>
        <p style={{ color: "#7C7168" }}>You don't have permission to view this page.</p>
      </div>
    );
  }

  const renderPage = () => {
    switch (activePage) {
      // PASS onNavigate HERE:
      case "dashboard": return <AdminDashboard onNavigate={setActivePage} />;
      case "artworks":  return <AdminArtworks />;
      case "artists":   return <AdminArtists />;
      case "orders":    return <AdminOrders />;
      case "users":     return <AdminUsers />;
      default:          return <AdminDashboard onNavigate={setActivePage} />;
    }
  };

  return (
    <AdminLayout activePage={activePage} onNavigate={setActivePage}>
      {renderPage()}
    </AdminLayout>
  );
}