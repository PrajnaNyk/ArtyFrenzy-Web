import { useState, useEffect } from "react";
import { artworkAPI } from "../services/api";
import "./AdminArtworks.css";

export default function AdminArtworks() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newArtwork, setNewArtwork] = useState({
    title: "",
    artist: "",
    price: "",
    category: "Painting",
    status: "Available",
    image: ""
  });

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      const res = await artworkAPI.getAll();
      setArtworks(res.data);
    } catch (err) {
      console.error("Failed to fetch artworks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddArtwork = async (e) => {
    e.preventDefault();
    try {
      await artworkAPI.create(newArtwork);
      setShowModal(false);
      setNewArtwork({ title: "", artist: "", price: "", category: "Painting", status: "Available", image: "" });
      fetchArtworks(); // Refresh list
    } catch (err) {
      console.error("Failed to add artwork:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this artwork?")) return;
    try {
      await artworkAPI.delete(id);
      fetchArtworks();
    } catch (err) {
      console.error("Failed to delete artwork:", err);
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
        <button className="admin-btn-primary" onClick={() => setShowModal(true)}>
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
                        src={art.image || "https://via.placeholder.com/42"} 
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
                    <button className="action-btn">Edit</button>
                    <button className="action-btn delete" onClick={() => handleDelete(art.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3 className="admin-modal-title">Add New Artwork</h3>
            <form onSubmit={handleAddArtwork}>
              <div className="admin-form-group">
                <label className="admin-form-label">Title</label>
                <input
                  className="admin-form-input"
                  required
                  value={newArtwork.title}
                  onChange={e => setNewArtwork({ ...newArtwork, title: e.target.value })}
                />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Artist</label>
                  <input
                    className="admin-form-input"
                    required
                    value={newArtwork.artist}
                    onChange={e => setNewArtwork({ ...newArtwork, artist: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Price (₹)</label>
                  <input
                    className="admin-form-input"
                    type="number"
                    required
                    value={newArtwork.price}
                    onChange={e => setNewArtwork({ ...newArtwork, price: e.target.value })}
                  />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Category</label>
                  <select
                    className="admin-form-input"
                    value={newArtwork.category}
                    onChange={e => setNewArtwork({ ...newArtwork, category: e.target.value })}
                  >
                    <option>Painting</option>
                    <option>Sculpture</option>
                    <option>Digital</option>
                    <option>Photography</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Status</label>
                  <select
                    className="admin-form-input"
                    value={newArtwork.status}
                    onChange={e => setNewArtwork({ ...newArtwork, status: e.target.value })}
                  >
                    <option>Available</option>
                    <option>Sold</option>
                  </select>
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Image URL</label>
                <input
                  className="admin-form-input"
                  placeholder="https://..."
                  value={newArtwork.image}
                  onChange={e => setNewArtwork({ ...newArtwork, image: e.target.value })}
                />
              </div>
              <div className="admin-form-actions">
                <button type="button" className="admin-btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  Save Artwork
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}