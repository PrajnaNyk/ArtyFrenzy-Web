import { useState, useEffect } from "react";
import { artworkAPI, artistAPI, paymentAPI } from "../services/api";
import "./AdminDashboard.css";

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="stat-card" style={{ borderTopColor: color }}>
      <div className="stat-card-icon" style={{ background: `${color}18`, color }}>
        {icon}
      </div>
      <div className="stat-card-info">
        <p className="stat-card-label">{label}</p>
        <p className="stat-card-value">{value}</p>
        {sub && <p className="stat-card-sub">{sub}</p>}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    artworks: 0,
    artists: 0,
    orders: 0,
    revenue: 0,
    pendingOrders: 0,
    paidOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [artworksRes, artistsRes] = await Promise.all([
        artworkAPI.getAll(),
        artistAPI.getAll(),
      ]);

      const artworks = artworksRes.data;
      const artists = artistsRes.data;

      setStats(prev => ({
        ...prev,
        artworks: artworks.length,
        artists: artists.length,
      }));
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">

      {/* ── Stats Grid ── */}
      <div className="admin-stats-grid">
        <StatCard
          icon="🎨"
          label="Total Artworks"
          value={stats.artworks}
          sub="Available in gallery"
          color="#C9963A"
        />
        <StatCard
          icon="✏️"
          label="Total Artists"
          value={stats.artists}
          sub="Registered artists"
          color="#6B7C6A"
        />
        <StatCard
          icon="📦"
          label="Total Orders"
          value={stats.orders}
          sub={`${stats.paidOrders} paid · ${stats.pendingOrders} pending`}
          color="#B5472A"
        />
        <StatCard
          icon="₹"
          label="Total Revenue"
          value={`₹${stats.revenue.toLocaleString()}`}
          sub="From paid orders"
          color="#1D9E75"
        />
      </div>

      {/* ── Quick Actions ── */}
      <div className="admin-section">
        <h2 className="admin-section-title">Quick Actions</h2>
        <div className="admin-quick-actions">
          <div className="quick-action-card">
            <span className="quick-action-icon">🎨</span>
            <div>
              <p className="quick-action-title">Add New Artwork</p>
              <p className="quick-action-desc">Upload a new artwork to the gallery</p>
            </div>
          </div>
          <div className="quick-action-card">
            <span className="quick-action-icon">✏️</span>
            <div>
              <p className="quick-action-title">Add New Artist</p>
              <p className="quick-action-desc">Register a new artist profile</p>
            </div>
          </div>
          <div className="quick-action-card">
            <span className="quick-action-icon">📦</span>
            <div>
              <p className="quick-action-title">View Orders</p>
              <p className="quick-action-desc">Manage and update order status</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Overview Cards ── */}
      <div className="admin-overview-grid">
        <div className="admin-overview-card">
          <h3 className="admin-overview-title">Gallery Overview</h3>
          <div className="admin-overview-items">
            <div className="admin-overview-item">
              <span>Total Artworks</span>
              <strong>{stats.artworks}</strong>
            </div>
            <div className="admin-overview-item">
              <span>Total Artists</span>
              <strong>{stats.artists}</strong>
            </div>
            <div className="admin-overview-item">
              <span>Avg. Price</span>
              <strong>₹{stats.artworks > 0 ? "10,000" : "—"}</strong>
            </div>
          </div>
        </div>

        <div className="admin-overview-card">
          <h3 className="admin-overview-title">Sales Overview</h3>
          <div className="admin-overview-items">
            <div className="admin-overview-item">
              <span>Total Orders</span>
              <strong>{stats.orders}</strong>
            </div>
            <div className="admin-overview-item">
              <span>Paid Orders</span>
              <strong style={{ color: "#1D9E75" }}>{stats.paidOrders}</strong>
            </div>
            <div className="admin-overview-item">
              <span>Pending Orders</span>
              <strong style={{ color: "#EF9F27" }}>{stats.pendingOrders}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}