import { useState, useEffect } from "react";
import { artistAPI } from "../services/api";
import "./AdminArtworks.css"; // Reusing the same CSS

export default function AdminArtists() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingArtist, setEditingArtist] = useState(null);
  
  // MATCHES YOUR EXACT SPRING BOOT MODEL
  const emptyForm = { name: "", location: "", bio: "", style: "", medium: "", instagram: "", website: "", avatarColor: "#C9963A" };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchArtists(); }, []);

  const fetchArtists = async () => {
    try {
      const res = await artistAPI.getAll();
      setArtists(res.data);
    } catch (err) {
      console.error("Failed to fetch artists:", err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingArtist(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (artist) => {
    setEditingArtist(artist);
    setForm({ ...artist });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        location: form.location,
        bio: form.bio.trim() || null,
        style: form.style.trim() || null,
        medium: form.medium.trim() || null,
        instagram: form.instagram.trim() || null,
        website: form.website.trim() || null,
        avatarColor: form.avatarColor || null,
      };

      if (editingArtist) {
        await artistAPI.update(editingArtist.id, payload);
      } else {
        await artistAPI.create(payload);
      }
      setShowModal(false);
      fetchArtists();
    } catch (err) {
      console.error("Failed to save artist:", err.response?.data || err.message);
      alert("Failed to save artist. Check console for details.");
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this artist?")) return;
    try {
      await artistAPI.delete(id);
      fetchArtists();
    } catch (err) {
      console.error("Failed to delete artist:", err.response?.data || err.message);
      alert("Failed to delete artist. They might have artworks linked to them.");
    }
  };

  const filteredArtists = artists.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.style?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="admin-loading">Loading artists...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 400 }}>Manage Artists</h2>
          <p style={{ fontSize: "14px", color: "#7C7168", marginTop: "4px" }}>{artists.length} total artists</p>
        </div>
        <button className="admin-btn-primary" onClick={openAddModal}><span>+</span> Add Artist</button>
      </div>

      <div className="admin-toolbar">
        <input type="text" className="admin-search-input" placeholder="Search by name or style..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="admin-table-container">
        {filteredArtists.length === 0 ? (
          <div className="admin-empty">No artists found.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Artist</th>
                <th>Location</th>
                <th>Style / Medium</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredArtists.map(art => (
                <tr key={art.id}>
                  <td>
                    <div className="artwork-info">
                      <div className="stat-card-icon" style={{ background: art.avatarColor || "#C9963A18", color: art.avatarColor ? "#fff" : "#C9963A", width: "42px", height: "42px", borderRadius: "50%", fontSize: "18px", flexShrink: 0 }}>
                        {art.name.charAt(0)}
                      </div>
                      <div>
                        <div className="artwork-title">{art.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>{art.location || "N/A"}</td>
                  <td>{art.style || "N/A"} / {art.medium || "N/A"}</td>
                  <td>
                    <button className="action-btn" onClick={() => openEditModal(art)}>Edit</button>
                    <button className="action-btn delete" onClick={() => handleDelete(art.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3 className="admin-modal-title">{editingArtist ? "Edit Artist" : "Add New Artist"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Name *</label>
                  <input className="admin-form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Location *</label>
                  <input className="admin-form-input" required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Style</label>
                  <input className="admin-form-input" placeholder="e.g. Abstract, Realism" value={form.style} onChange={e => setForm({ ...form, style: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Medium</label>
                  <input className="admin-form-input" placeholder="e.g. Oil, Watercolor" value={form.medium} onChange={e => setForm({ ...form, medium: e.target.value })} />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Instagram</label>
                  <input className="admin-form-input" placeholder="@username" value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Website</label>
                  <input className="admin-form-input" placeholder="https://..." value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Avatar Color</label>
                <input className="admin-form-input" type="color" value={form.avatarColor || "#C9963A"} onChange={e => setForm({ ...form, avatarColor: e.target.value })} />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Bio</label>
                <textarea className="admin-form-input admin-form-textarea" rows={3} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
              </div>

              <div className="admin-form-actions">
                <button type="button" className="admin-btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="admin-btn-primary">{editingArtist ? "Update Artist" : "Save Artist"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}