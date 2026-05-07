import { useState } from "react";
import "./ArtistProfile.css";

const artistsData = {
  "Meera Nair": {
    name: "Meera Nair",
    location: "Kochi, Kerala",
    bio: "Meera Nair is a contemporary abstract artist whose work explores the intersection of emotion and color. With over 12 years of experience, her paintings have been exhibited across India and internationally.",
    style: "Abstract Expressionism",
    medium: "Oil on Canvas",
    exhibitions: ["Mumbai Art Fair 2023", "Kochi Biennale 2022", "Delhi Contemporary 2021"],
    social: { instagram: "@meera.art", website: "meeranair.com" },
    avatar: "M",
    coverColor: "#C9963A",
    totalSales: 48,
    artworks: [
      { id: 1, title: "Crimson Reverie", price: 12500, category: "Abstract", image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&q=80", tag: "Featured" },
    ]
  },
  "Arjun Pillai": {
    name: "Arjun Pillai",
    location: "Bangalore, Karnataka",
    bio: "Arjun Pillai captures the serene beauty of Indian landscapes through impressionistic techniques. His work reflects a deep connection with nature and light.",
    style: "Landscape Impressionism",
    medium: "Watercolor & Acrylic",
    exhibitions: ["Bangalore Art Week 2023", "Chennai Gallery Show 2022"],
    social: { instagram: "@arjun.pillai.art", website: "arjunpillai.in" },
    avatar: "A",
    coverColor: "#6B7C6A",
    totalSales: 32,
    artworks: [
      { id: 2, title: "Golden Horizons", price: 8900, category: "Landscape", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80", tag: "New" },
    ]
  },
};

export default function ArtistProfile({ artistName, onClose, onAddToCart, cart }) {
  const [activeTab, setActiveTab] = useState("artworks");
  const artist = artistsData[artistName] || Object.values(artistsData)[0];

  return (
    <div className="artist-profile-overlay" onClick={onClose}>
      <div className="artist-profile" onClick={e => e.stopPropagation()}>
        <button className="artist-profile-close" onClick={onClose}>✕</button>

        {/* Cover & Avatar */}
        <div className="artist-cover" style={{ background: `linear-gradient(135deg, ${artist.coverColor}33, #1C191733)` }}>
          <div className="artist-avatar-wrap">
            <div className="artist-avatar" style={{ background: artist.coverColor }}>
              {artist.avatar}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="artist-info">
          <div className="artist-info-header">
            <div>
              <h2 className="artist-name">{artist.name}</h2>
              <p className="artist-location">📍 {artist.location}</p>
            </div>
            <div className="artist-stats">
              <div className="artist-stat">
                <span className="artist-stat-num">{artist.artworks.length}</span>
                <span className="artist-stat-label">Works</span>
              </div>
              <div className="artist-stat">
                <span className="artist-stat-num">{artist.totalSales}</span>
                <span className="artist-stat-label">Sold</span>
              </div>
            </div>
          </div>

          <div className="artist-tags">
            <span className="artist-tag">{artist.style}</span>
            <span className="artist-tag">{artist.medium}</span>
          </div>

          {/* Tabs */}
          <div className="artist-tabs">
            <button className={`artist-tab ${activeTab === "artworks" ? "active" : ""}`} onClick={() => setActiveTab("artworks")}>Artworks</button>
            <button className={`artist-tab ${activeTab === "about" ? "active" : ""}`} onClick={() => setActiveTab("about")}>About</button>
            <button className={`artist-tab ${activeTab === "exhibitions" ? "active" : ""}`} onClick={() => setActiveTab("exhibitions")}>Exhibitions</button>
          </div>

          {/* Tab Content */}
          {activeTab === "artworks" && (
            <div className="artist-artworks-grid">
              {artist.artworks.map(art => (
                <div className="artist-artwork-card" key={art.id}>
                  <div className="artist-artwork-img">
                    <img src={art.image} alt={art.title} />
                    {art.tag && <span className="art-tag">{art.tag}</span>}
                  </div>
                  <div className="artist-artwork-info">
                    <h4>{art.title}</h4>
                    <p>{art.category}</p>
                    <div className="artist-artwork-footer">
                      <span>₹{art.price.toLocaleString()}</span>
                      <button className="wishlist-add-cart-btn" onClick={() => onAddToCart(art)}>
                        {cart && cart.find(i => i.id === art.id) ? "✓ In Cart" : "+ Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "about" && (
            <div className="artist-about">
              <p className="artist-bio">{artist.bio}</p>
              <div className="artist-social">
                <h4>Connect</h4>
                <p>📸 Instagram: {artist.social.instagram}</p>
                <p>🌐 Website: {artist.social.website}</p>
              </div>
            </div>
          )}

          {activeTab === "exhibitions" && (
            <div className="artist-exhibitions">
              {artist.exhibitions.map((ex, i) => (
                <div className="exhibition-item" key={i}>
                  <span className="exhibition-dot">✦</span>
                  <span>{ex}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}