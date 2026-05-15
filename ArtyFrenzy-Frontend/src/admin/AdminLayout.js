import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import "./AdminLayout.css";

const navItems = [
  { key: "dashboard", icon: "◈", label: "Dashboard" },
  { key: "artworks", icon: "🎨", label: "Artworks" },
  { key: "artists", icon: "✏️", label: "Artists" },
  { key: "orders", icon: "📦", label: "Orders" },
  { key: "users", icon: "👥", label: "Users" },
];

export default function AdminLayout({ activePage, onNavigate, children }) {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`admin-layout ${collapsed ? "collapsed" : ""}`}>
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <span className="admin-logo-icon">✦</span>
            {!collapsed && <span className="admin-logo-text">ArtyFrenzy</span>}
          </div>
          <button
            className="admin-collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? "›" : "‹"}
          </button>
        </div>

        {!collapsed && (
          <div className="admin-sidebar-label">Admin Panel</div>
        )}

        <nav className="admin-nav">
          {navItems.map(item => (
            <button
              key={item.key}
              className={`admin-nav-item ${activePage === item.key ? "active" : ""}`}
              onClick={() => onNavigate(item.key)}
              title={collapsed ? item.label : ""}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {!collapsed && <span className="admin-nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div>
                <p className="admin-user-name">{user?.name}</p>
                <p className="admin-user-role">Administrator</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button className="admin-logout-btn" onClick={logout}>
              ↩ Sign out
            </button>
          )}
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="admin-main">
        <div className="admin-topbar">
          <h1 className="admin-page-title">
            {navItems.find(i => i.key === activePage)?.icon}{" "}
            {navItems.find(i => i.key === activePage)?.label}
          </h1>
          <div className="admin-topbar-right">
            <span className="admin-topbar-date">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
        </div>
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
}