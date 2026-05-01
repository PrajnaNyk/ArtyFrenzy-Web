import { useState, useEffect } from "react";
import "./App.css";

const artworks = [
  { id: 1, title: "Crimson Reverie", artist: "Meera Nair", price: 12500, category: "Abstract", image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80", tag: "Featured" },
  { id: 2, title: "Golden Horizons", artist: "Arjun Pillai", price: 8900, category: "Landscape", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80", tag: "New" },
  { id: 3, title: "Silent Waters", artist: "Priya Sharma", price: 15000, category: "Impressionism", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", tag: "" },
  { id: 4, title: "Urban Pulse", artist: "Rahul Desai", price: 6500, category: "Modern", image: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=600&q=80", tag: "Trending" },
  { id: 5, title: "Eternal Bloom", artist: "Kavya Reddy", price: 19000, category: "Floral", image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80", tag: "Featured" },
  { id: 6, title: "Midnight Echo", artist: "Siddharth R.", price: 11200, category: "Abstract", image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=600&q=80", tag: "" },
  { id: 7, title: "Desert Song", artist: "Ananya Iyer", price: 7800, category: "Landscape", image: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=600&q=80", tag: "New" },
  { id: 8, title: "The Wanderer", artist: "Vikram Nath", price: 22000, category: "Portrait", image: "https://images.unsplash.com/photo-1576020799627-aeac74d58064?w=600&q=80", tag: "" },
];

const categories = ["All", "Abstract", "Landscape", "Impressionism", "Modern", "Floral", "Portrait"];

export default function App() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedArt, setSelectedArt] = useState(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered = activeCategory === "All" ? artworks : artworks.filter(a => a.category === activeCategory);

  const addToCart = (art) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === art.id);
      return exists ? prev : [...prev, { ...art, qty: 1 }];
    });
    setToast(`"${art.title}" added to cart!`);
    setTimeout(() => setToast(""), 2500);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const total = cart.reduce((s, i) => s + i.price, 0);

  return (
    <div className="app">
      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}

      {/* Navbar */}
      <nav className={`navbar ${navScrolled ? "scrolled" : ""}`}>
        <div className="nav-logo">
          <span className="logo-icon">✦</span>
          <span className="logo-text">ArtyFrenzy</span>
        </div>
        <div className="nav-links">
          <a href="#gallery">Gallery</a>
          <a href="#artists">Artists</a>
          <a href="#about">About</a>
        </div>
        <button className="cart-btn" onClick={() => setCartOpen(true)}>
          <span className="cart-icon">🛍</span>
          <span>Cart</span>
          {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
        </button>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="blob blob1" />
          <div className="blob blob2" />
          <div className="blob blob3" />
        </div>
        <div className="hero-content">
          <p className="hero-eyebrow">✦ Curated Fine Art Marketplace</p>
          <h1 className="hero-title">
            Where Art Finds<br />
            <span className="hero-accent">Its Collector</span>
          </h1>
          <p className="hero-sub">Discover original artworks by India's finest contemporary artists. Every piece tells a story — find yours.</p>
          <div className="hero-actions">
            <a href="#gallery" className="btn-primary">Explore Gallery</a>
            <a href="#about" className="btn-ghost">Our Story</a>
          </div>
          <div className="hero-stats">
            <div className="stat"><span className="stat-num">240+</span><span className="stat-label">Artworks</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">80+</span><span className="stat-label">Artists</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">1.2k</span><span className="stat-label">Collectors</span></div>
          </div>
        </div>
        <div className="hero-image-grid">
          <div className="hero-img hero-img-1"><img src={artworks[0].image} alt="" /></div>
          <div className="hero-img hero-img-2"><img src={artworks[4].image} alt="" /></div>
          <div className="hero-img hero-img-3"><img src={artworks[2].image} alt="" /></div>
        </div>
      </section>

      {/* Gallery */}
      <section className="gallery-section" id="gallery">
        <div className="section-header">
          <p className="section-eyebrow">✦ Our Collection</p>
          <h2 className="section-title">Featured Artworks</h2>
        </div>

        {/* Filter */}
        <div className="filter-bar">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="art-grid">
          {filtered.map((art, i) => (
            <div className="art-card" key={art.id} style={{ animationDelay: `${i * 0.07}s` }}>
              <div className="art-img-wrap" onClick={() => setSelectedArt(art)}>
                <img src={art.image} alt={art.title} />
                <div className="art-overlay">
                  <button className="view-btn">View Details</button>
                </div>
                {art.tag && <span className="art-tag">{art.tag}</span>}
              </div>
              <div className="art-info">
                <div className="art-meta">
                  <span className="art-category">{art.category}</span>
                </div>
                <h3 className="art-title">{art.title}</h3>
                <p className="art-artist">by {art.artist}</p>
                <div className="art-footer">
                  <span className="art-price">₹{art.price.toLocaleString()}</span>
                  <button className="add-cart-btn" onClick={() => addToCart(art)}>
                    {cart.find(i => i.id === art.id) ? "✓ Added" : "+ Cart"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="about-inner">
          <div className="about-text">
            <p className="section-eyebrow">✦ Our Story</p>
            <h2 className="section-title">Art Should Be<br />Accessible to All</h2>
            <p className="about-desc">ArtyFrenzy was born from a simple belief — that extraordinary art deserves extraordinary collectors. We connect India's most talented artists directly with passionate art lovers, removing the gallery middleman.</p>
            <div className="about-features">
              <div className="feature"><span className="feature-icon">🎨</span><span>100% Original Artworks</span></div>
              <div className="feature"><span className="feature-icon">🔐</span><span>Secure & Verified Transactions</span></div>
              <div className="feature"><span className="feature-icon">🚚</span><span>Pan-India Delivery</span></div>
              <div className="feature"><span className="feature-icon">↩️</span><span>30-Day Return Policy</span></div>
            </div>
          </div>
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80" alt="Artist at work" />
            <div className="about-badge">
              <span className="badge-num">12+</span>
              <span className="badge-text">Years of<br/>Art Curation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-logo">
          <span className="logo-icon">✦</span>
          <span className="logo-text">ArtyFrenzy</span>
        </div>
        <p className="footer-tagline">Where art finds its collector.</p>
        <p className="footer-copy">© 2026 ArtyFrenzy. All rights reserved.</p>
      </footer>

      {/* Art Detail Modal */}
      {selectedArt && (
        <div className="modal-overlay" onClick={() => setSelectedArt(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedArt(null)}>✕</button>
            <div className="modal-content">
              <div className="modal-img">
                <img src={selectedArt.image} alt={selectedArt.title} />
              </div>
              <div className="modal-info">
                <span className="art-category">{selectedArt.category}</span>
                <h2 className="modal-title">{selectedArt.title}</h2>
                <p className="modal-artist">by {selectedArt.artist}</p>
                <p className="modal-desc">A stunning original artwork that brings life, color and emotion to any space. Hand-crafted with premium materials, this piece is certified original and comes with a certificate of authenticity.</p>
                <div className="modal-details">
                  <div className="detail"><span>Medium</span><strong>Oil on Canvas</strong></div>
                  <div className="detail"><span>Size</span><strong>24" × 36"</strong></div>
                  <div className="detail"><span>Year</span><strong>2025</strong></div>
                  <div className="detail"><span>Delivery</span><strong>7–10 Days</strong></div>
                </div>
                <div className="modal-price">₹{selectedArt.price.toLocaleString()}</div>
                <button className="btn-primary full" onClick={() => { addToCart(selectedArt); setSelectedArt(null); }}>
                  {cart.find(i => i.id === selectedArt.id) ? "✓ Already in Cart" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="cart-overlay" onClick={() => setCartOpen(false)}>
          <div className="cart-drawer" onClick={e => e.stopPropagation()}>
            <div className="cart-header">
              <h3>Your Cart ({cart.length})</h3>
              <button onClick={() => setCartOpen(false)}>✕</button>
            </div>
            {cart.length === 0 ? (
              <div className="cart-empty">
                <span>🎨</span>
                <p>Your cart is empty.<br />Start collecting art!</p>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(item => (
                    <div className="cart-item" key={item.id}>
                      <img src={item.image} alt={item.title} />
                      <div className="cart-item-info">
                        <p className="cart-item-title">{item.title}</p>
                        <p className="cart-item-artist">by {item.artist}</p>
                        <p className="cart-item-price">₹{item.price.toLocaleString()}</p>
                      </div>
                      <button className="remove-btn" onClick={() => removeFromCart(item.id)}>✕</button>
                    </div>
                  ))}
                </div>
                <div className="cart-footer">
                  <div className="cart-total">
                    <span>Total</span>
                    <strong>₹{total.toLocaleString()}</strong>
                  </div>
                  <button className="btn-primary full">Proceed to Checkout</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}