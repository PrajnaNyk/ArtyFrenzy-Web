import { useState, useEffect } from "react";
import { artworkAPI } from "../services/api";
import "./AdminArtworks.css";

export default function AdminArtworks() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState(null);
  
  const emptyForm = { title: "", artist: "", price: "", category: "Painting", status: "Available", imageUrl: "", description: "", tag: "" };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      const res = await artworkAPI.getAllAdmin();
      setArtworks(res.data);
    } catch (err) {
      console.error("Failed to fetch artworks:", err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingArtwork(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (art) => {
    setEditingArtwork(art);
    setForm({ ...art, price: art.price?.toString() || "" }); 
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // FIX: Safely parse price. If invalid, stop submission.
    const parsedPrice = parseFloat(form.price);
    if (isNaN(parsedPrice)) {
      alert("Please enter a valid price.");
      return; 
    }

    // FIX: Construct a clean payload matching your Spring Boot Entity exactly.
    // Convert empty strings to null so Spring Boot doesn't complain about blank constraints.
    const payload = {
      title: form.title,
      artist: form.artist,
      price: parsedPrice, // Send as a proper Java Double number
      category: form.category,
      status: form.status,
      imageUrl: form.imageUrl.trim() || null,
      description: form.description.trim() || null,
      tag: form.tag.trim() || null,
    };

    try {
      if (editingArtwork) {
        await artworkAPI.update(editingArtwork.id, payload);
      } else {
        await artworkAPI.create(payload);
      }
      
      setShowModal(false);
      fetchArtworks(); 
    } catch (err) {
      console.error("Failed to save artwork:", err.response?.data || err.message);
      alert("Failed to save artwork. Check console for details.");
    }
  };

  const handleDelete = async (id) => {
    // FIX: Safety check to prevent /api/artworks/undefined (404 error)
    if (!id) return; 
    
    if (!window.confirm("Are you sure you want to delete this artwork?")) return;
    try {
      await artworkAPI.delete(id);
      fetchArtworks();
    } catch (err) {
      console.error("Failed to delete artwork:", err.response?.data || err.message);
      alert("Failed to delete artwork. It might be linked to an Order.");
    }
  };

  const filteredArtworks = artworks.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.artist?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="admin-loading">Loading artworks...</div>;

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 400 }}>
            Manage Artworks
          </h2>
          <p style={{ fontSize: "14px", color: "#7C7168", marginTop: "4px" }}>
            {artworks.length} total artworks
          </p>
        </div>
        <button className="admin-btn-primary" onClick={openAddModal}>
          <span>+</span> Add Artwork
        </button>
      </div>

      {/* Toolbar */}
      <div className="admin-toolbar">
        <input
          type="text"
          className="admin-search-input"
          placeholder="Search by title or artist..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="admin-table-container">
        {filteredArtworks.length === 0 ? (
          <div className="admin-empty">No artworks found.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Artwork</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredArtworks.map(art => (
                <tr key={art.id}>
                  <td>
                    <div className="artwork-info">
                      <img 
                        src={art.imageUrl || "https://via.placeholder.com/42"} 
                        alt={art.title} 
                        className="artwork-thumb" 
                      />
                      <div>
                        <div className="artwork-title">{art.title}</div>
                        <div style={{ fontSize: "12px", color: "#7C7168" }}>
                          by {art.artist || "Unknown"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{art.category}</td>
                  <td>₹{Number(art.price).toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${art.status === 'Available' ? 'status-available' : 'status-sold'}`}>
                      {art.status}
                    </span>
                  </td>
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
            <h3 className="admin-modal-title">
              {editingArtwork ? "Edit Artwork" : "Add New Artwork"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label className="admin-form-label">Title</label>
                <input className="admin-form-input" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Artist</label>
                  <input className="admin-form-input" required value={form.artist} onChange={e => setForm({ ...form, artist: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Price (₹)</label>
                  <input className="admin-form-input" type="number" step="0.01" required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Category</label>
                  <select className="admin-form-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option>Abstract</option>
                    <option>Landscape</option>
                    <option>Impressionism</option>
                    <option>Modern</option>
                    <option>Floral</option>
                    <option>Portrait</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Status</label>
                  <select className="admin-form-input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    <option>Available</option>
                    <option>Sold</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Tag (Optional)</label>
                <input className="admin-form-input" placeholder="e.g. New, Featured" value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Image URL</label>
                <input className="admin-form-input" placeholder="https://..." value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Description</label>
                <textarea 
                  className="admin-form-input admin-form-textarea" 
                  value={form.description} 
                  onChange={e => setForm({ ...form, description: e.target.value })} 
                />
              </div>

              <div className="admin-form-actions">
                <button type="button" className="admin-btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  {editingArtwork ? "Update Artwork" : "Save Artwork"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}