import { useState, useEffect } from "react";
import { artistAPI } from "../services/api";
import "./ArtistProfile.css";

export default function ArtistProfile({ artistName, onClose, onAddToCart, cart }) {
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    fetchArtist();
  }, [artistName]);

  const fetchArtist = async () => {
    try {
      setLoading(true);
      const res = await artistAPI.getByName(artistName);
      setArtist(res.data);
    } catch (err) {
      console.error("Failed to fetch artist:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="artist-profile-overlay" onClick={onClose}>
      <div className="artist-profile" onClick={e => e.stopPropagation()}>
        <button className="artist-profile-close" onClick={onClose}>✕</button>

        {loading ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#7C7168" }}>
            Loading artist...
          </div>
        ) : !artist ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#7C7168" }}>
            Artist not found.
          </div>
        ) : (
          <>
            <div className="artist-cover" style={{ background: `linear-gradient(135deg, ${artist.avatarColor}33, #1C191733)` }}>
              <div className="artist-avatar-wrap">
                <div className="artist-avatar" style={{ background: artist.avatarColor }}>
                  {artist.name.charAt(0)}
                </div>
              </div>
            </div>

            <div className="artist-info">
              <div className="artist-info-header">
                <div>
                  <h2 className="artist-name">{artist.name}</h2>
                  <p className="artist-location">📍 {artist.location}</p>
                </div>
              </div>

              <div className="artist-tags">
                {artist.style && <span className="artist-tag">{artist.style}</span>}
                {artist.medium && <span className="artist-tag">{artist.medium}</span>}
              </div>

              <div className="artist-tabs">
                <button className={`artist-tab ${activeTab === "about" ? "active" : ""}`} onClick={() => setActiveTab("about")}>About</button>
                <button className={`artist-tab ${activeTab === "contact" ? "active" : ""}`} onClick={() => setActiveTab("contact")}>Contact</button>
              </div>

              {activeTab === "about" && (
                <div className="artist-about">
                  <p className="artist-bio">{artist.bio}</p>
                </div>
              )}

              {activeTab === "contact" && (
                <div className="artist-about">
                  <div className="artist-social">
                    {artist.instagram && <p>📸 Instagram: {artist.instagram}</p>}
                    {artist.website && <p>🌐 Website: {artist.website}</p>}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}