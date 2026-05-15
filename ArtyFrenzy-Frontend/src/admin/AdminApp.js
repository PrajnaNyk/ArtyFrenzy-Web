import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import AdminLayout from "./AdminLayout";
import AdminDashboard from "./AdminDashboard";

// Placeholder pages - will be replaced with real ones
function ComingSoon({ page }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", height: "50vh", gap: "16px", color: "#7C7168"
    }}>
      <span style={{ fontSize: "48px" }}>🚧</span>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 300, color: "#1C1917" }}>
        {page} Coming Soon
      </h2>
      <p style={{ fontSize: "14px" }}>This page will be added next.</p>
    </div>
  );
}

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
      case "dashboard": return <AdminDashboard />;
      case "artworks":  return <ComingSoon page="Artworks" />;
      case "artists":   return <ComingSoon page="Artists" />;
      case "orders":    return <ComingSoon page="Orders" />;
      case "users":     return <ComingSoon page="Users" />;
      default:          return <AdminDashboard />;
    }
  };

  return (
    <AdminLayout activePage={activePage} onNavigate={setActivePage}>
      {renderPage()}
    </AdminLayout>
  );
}