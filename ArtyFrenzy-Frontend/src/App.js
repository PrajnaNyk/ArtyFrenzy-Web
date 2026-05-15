import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { RecentlyViewedProvider, useRecentlyViewed } from "./context/RecentlyViewedContext";
import WishlistButton from "./components/WishlistButton";
import RecentlyViewed from "./components/RecentlyViewed";
import ReviewSection from "./components/ReviewSection";
import WishlistPage from "./pages/WishlistPage";
import ArtistProfile from "./pages/ArtistProfile";
import { artworkAPI } from "./services/api";
import CheckoutPage from "./pages/CheckoutPage";
import "./App.css";
import "./auth/Auth.css";

const categories = ["All", "Abstract", "Landscape", "Impressionism", "Modern", "Floral", "Portrait"];

// ── Login Form ──
function LoginForm({ onSwitchToRegister, onClose }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-art-stack">
          <div className="auth-art auth-art-1"><img src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&q=80" alt="" /></div>
          <div className="auth-art auth-art-2"><img src="https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&q=80" alt="" /></div>
          <div className="auth-art auth-art-3"><img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" alt="" /></div>
        </div>
        <div className="auth-left-content">
          <div className="auth-logo"><span className="auth-logo-star">✦</span><span className="auth-logo-text">ArtyFrenzy</span></div>
          <p className="auth-left-quote">"Every artist dips his brush in his own soul."</p>
          <p className="auth-left-author">— Henry Ward Beecher</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-wrap">
          <p className="auth-eyebrow">✦ Welcome back</p>
          <h2 className="auth-title">Sign in to your<br />collection</h2>
          <p className="auth-sub">Don't have an account? <button className="auth-switch-btn" onClick={onSwitchToRegister}>Create one</button></p>
          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}
            <div className="auth-field">
              <label className="auth-label">Email address</label>
              <input className="auth-input" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
            </div>
            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <input className="auth-input" type={showPass ? "text" : "password"} name="password" placeholder="Enter your password" value={form.password} onChange={handleChange} />
                <button type="button" className="auth-toggle-pass" onClick={() => setShowPass(!showPass)}>{showPass ? "Hide" : "Show"}</button>
              </div>
            </div>
            <button className="auth-submit-btn" type="submit" disabled={loading}>
              {loading ? <span className="auth-spinner" /> : "Sign in"}
            </button>
            <div className="auth-divider"><span>or continue with</span></div>
            <div className="auth-social-btns">
              <button type="button" className="auth-social-btn">Google</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Register Form ──
function RegisterForm({ onSwitchToLogin, onClose }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); };

  const getStrength = (p) => {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };

  const strength = getStrength(form.password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#E24B4A", "#EF9F27", "#1D9E75", "#0F6E56"][strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm) { setError("Please fill in all fields."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left auth-left-reg">
        <div className="auth-art-stack">
          <div className="auth-art auth-art-1"><img src="https://images.unsplash.com/photo-1549887534-1541e9326642?w=400&q=80" alt="" /></div>
          <div className="auth-art auth-art-2"><img src="https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=400&q=80" alt="" /></div>
          <div className="auth-art auth-art-3"><img src="https://images.unsplash.com/photo-1576020799627-aeac74d58064?w=400&q=80" alt="" /></div>
        </div>
        <div className="auth-left-content">
          <div className="auth-logo"><span className="auth-logo-star">✦</span><span className="auth-logo-text">ArtyFrenzy</span></div>
          <p className="auth-left-quote">"Art is not what you see, but what you make others see."</p>
          <p className="auth-left-author">— Edgar Degas</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-wrap">
          <p className="auth-eyebrow">✦ Join ArtyFrenzy</p>
          <h2 className="auth-title">Start your art<br />journey today</h2>
          <p className="auth-sub">Already have an account? <button className="auth-switch-btn" onClick={onSwitchToLogin}>Sign in</button></p>
          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}
            <div className="auth-field"><label className="auth-label">Full name</label><input className="auth-input" type="text" name="name" placeholder="Priya Sharma" value={form.name} onChange={handleChange} /></div>
            <div className="auth-field"><label className="auth-label">Email address</label><input className="auth-input" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} /></div>
            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <input className="auth-input" type={showPass ? "text" : "password"} name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} />
                <button type="button" className="auth-toggle-pass" onClick={() => setShowPass(!showPass)}>{showPass ? "Hide" : "Show"}</button>
              </div>
              {form.password && (
                <div className="strength-wrap">
                  <div className="strength-bar">{[1, 2, 3, 4].map(i => <div key={i} className="strength-seg" style={{ background: i <= strength ? strengthColor : "rgba(44,40,37,0.1)" }} />)}</div>
                  <span className="strength-label" style={{ color: strengthColor }}>{strengthLabel}</span>
                </div>
              )}
            </div>
            <div className="auth-field"><label className="auth-label">Confirm password</label><input className="auth-input" type={showPass ? "text" : "password"} name="confirm" placeholder="Re-enter your password" value={form.confirm} onChange={handleChange} /></div>
            <button className="auth-submit-btn" type="submit" disabled={loading}>{loading ? <span className="auth-spinner" /> : "Create account"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Auth Modal ──
function AuthModal({ mode, onClose }) {
  const [authMode, setAuthMode] = useState(mode);
  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-box" onClick={e => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>✕</button>
        {authMode === "login"
          ? <LoginForm onSwitchToRegister={() => setAuthMode("register")} onClose={onClose} />
          : <RegisterForm onSwitchToLogin={() => setAuthMode("login")} onClose={onClose} />}
      </div>
    </div>
  );
}

// ── Main App ──
function AppInner() {
  const { user, logout, isLoggedIn } = useAuth();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const [artworks, setArtworks] = useState([]);
  const [artworksLoading, setArtworksLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  // ── USER-SPECIFIC CART LOGIC ──
  const [cart, setCart] = useState([]);

  // Load cart when user logs in
  useEffect(() => {
    if (isLoggedIn && user?.id) {
      try {
        const savedCart = JSON.parse(localStorage.getItem(`af_cart_${user.id}`)) || [];
        setCart(savedCart);
      } catch {
        setCart([]);
      }
    } else {
      setCart([]); // Clear UI when logged out
    }
  }, [isLoggedIn, user?.id]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoggedIn && user?.id) {
      localStorage.setItem(`af_cart_${user.id}`, JSON.stringify(cart));
    }
  }, [cart, isLoggedIn, user?.id]);

  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedArt, setSelectedArt] = useState(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const [toast, setToast] = useState("");
  const [authModal, setAuthModal] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);

  // Fetch artworks from backend
  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const res = await artworkAPI.getAll();
        setArtworks(res.data);
      } catch (err) {
        console.error("Failed to fetch artworks:", err);
      } finally {
        setArtworksLoading(false);
      }
    };
    fetchArtworks();
  }, []);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered = activeCategory === "All"
    ? artworks
    : artworks.filter(a => a.category === activeCategory);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const addToCart = (art) => {
    if (!isLoggedIn) { setAuthModal("login"); showToast("Please login to add items to cart!"); return; }
    setCart(prev => prev.find(i => i.id === art.id) ? prev : [...prev, { ...art }]);
    showToast(`"${art.title}" added to cart!`);
  };

  const handleSelectArt = (art) => {
    setSelectedArt(art);
    addToRecentlyViewed(art);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const total = cart.reduce((s, i) => s + i.price, 0);
  
  const handleLogout = () => { 
    logout(); 
    setUserMenuOpen(false); 
    showToast("Logged out successfully!"); 
  };

  return (
    <div className="app">
      {toast && <div className="toast">{toast}</div>}
      {authModal && <AuthModal mode={authModal} onClose={() => setAuthModal(null)} />}
      {selectedArtist && (
        <ArtistProfile artistName={selectedArtist} onClose={() => setSelectedArtist(null)} onAddToCart={addToCart} cart={cart} />
      )}

      {/* ── Wishlist Modal ── */}
      {wishlistOpen && (
        <div className="auth-modal-overlay" onClick={() => setWishlistOpen(false)}>
          <div className="wishlist-modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setWishlistOpen(false)}>✕</button>
            <WishlistPage onAddToCart={addToCart} cart={cart} onClose={() => setWishlistOpen(false)} />
          </div>
        </div>
      )}

      {/* ── Payment ── */}
      {checkoutOpen && (
        <CheckoutPage
          cart={cart}
          onClose={() => setCheckoutOpen(false)}
          onPaymentSuccess={() => {
            setCart([]);
            setCheckoutOpen(false);
            setCartOpen(false);
            showToast("🎨 Payment successful! Thank you for your purchase!");
          }}
        />
      )}

      {/* ── Navbar ── */}
      <nav className={`navbar ${navScrolled ? "scrolled" : ""}`}>
        <div className="nav-logo"><span className="logo-icon">✦</span><span className="logo-text">ArtyFrenzy</span></div>
        <div className="nav-links">
          <a href="#gallery">Gallery</a>
          <a href="#about">About</a>
        </div>
        <div className="nav-actions">
          {isLoggedIn ? (
            <div className="user-menu-wrap">
              <button className="user-avatar-btn" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                <span className="user-name-nav">{user.name.split(" ")[0]}</span>
                <span className="user-arrow">{userMenuOpen ? "▲" : "▼"}</span>
              </button>
              {userMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <div className="user-avatar-lg">{user.name.charAt(0).toUpperCase()}</div>
                    <div><p className="dropdown-name">{user.name}</p><p className="dropdown-email">{user.email}</p></div>
                  </div>
                  <div className="user-dropdown-divider" />
                  <button className="dropdown-item" onClick={() => { setWishlistOpen(true); setUserMenuOpen(false); }}>♡ My Wishlist</button>
                  <button className="dropdown-item">📦 My Orders</button>
                  <button className="dropdown-item">⚙️ Settings</button>
                  <div className="user-dropdown-divider" />
                  <button className="dropdown-item dropdown-logout" onClick={handleLogout}>↩ Sign out</button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn-nav-register" onClick={() => setAuthModal("login")}>Sign in</button>
          )}
          <button className="cart-btn" onClick={() => setCartOpen(true)}>
            <span>🛍</span><span>Cart</span>
            {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg"><div className="blob blob1" /><div className="blob blob2" /><div className="blob blob3" /></div>
        <div className="hero-content">
          <p className="hero-eyebrow">✦ Curated Fine Art Marketplace</p>
          <h1 className="hero-title">Where Art Finds<br /><span className="hero-accent">Its Collector</span></h1>
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
          <div className="hero-img hero-img-1"><img src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80" alt="" /></div>
          <div className="hero-img hero-img-2"><img src="https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80" alt="" /></div>
          <div className="hero-img hero-img-3"><img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" alt="" /></div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className="gallery-section" id="gallery">
        <div className="section-header">
          <p className="section-eyebrow">✦ Our Collection</p>
          <h2 className="section-title">Featured Artworks</h2>
        </div>
        <div className="filter-bar">
          {categories.map(cat => (
            <button key={cat} className={`filter-btn ${activeCategory === cat ? "active" : ""}`} onClick={() => setActiveCategory(cat)}>{cat}</button>
          ))}
        </div>

        {artworksLoading ? (
          <div className="artworks-loading">
            <p>Loading artworks...</p>
          </div>
        ) : (
          <div className="art-grid">
            {filtered.map((art, i) => (
              <div className="art-card" key={art.id} style={{ animationDelay: `${i * 0.07}s` }}>
                <div className="art-img-wrap" onClick={() => handleSelectArt(art)}>
                  <img src={art.imageUrl} alt={art.title} />
                  <div className="art-overlay"><button className="view-btn">View Details</button></div>
                  {art.tag && <span className="art-tag">{art.tag}</span>}
                  <WishlistButton artwork={art} onLoginRequired={() => setAuthModal("login")} />
                </div>
                <div className="art-info">
                  <span className="art-category">{art.category}</span>
                  <h3 className="art-title">{art.title}</h3>
                  <p className="art-artist">
                    by{" "}
                    <button className="artist-link" onClick={() => setSelectedArtist(art.artist)}>
                      {art.artist}
                    </button>
                  </p>
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
        )}
      </section>

      {/* ── Recently Viewed ── */}
      <RecentlyViewed onSelectArt={handleSelectArt} />

      {/* ── About ── */}
      <section className="about-section" id="about">
        <div className="about-inner">
          <div className="about-text">
            <p className="section-eyebrow">✦ Our Story</p>
            <h2 className="section-title">Art Should Be<br />Accessible to All</h2>
            <p className="about-desc">ArtyFrenzy was born from a simple belief — that extraordinary art deserves extraordinary collectors. We connect India's most talented artists directly with passionate art lovers.</p>
            <div className="about-features">
              <div className="feature"><span className="feature-icon">🎨</span><span>100% Original Artworks</span></div>
              <div className="feature"><span className="feature-icon">🔐</span><span>Secure & Verified Transactions</span></div>
              <div className="feature"><span className="feature-icon">🚚</span><span>Pan-India Delivery</span></div>
              <div className="feature"><span className="feature-icon">↩️</span><span>30-Day Return Policy</span></div>
            </div>
          </div>
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80" alt="Artist at work" />
            <div className="about-badge"><span className="badge-num">12+</span><span className="badge-text">Years of<br />Art Curation</span></div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-logo"><span className="logo-icon">✦</span><span className="logo-text">ArtyFrenzy</span></div>
        <p className="footer-tagline">Where art finds its collector.</p>
        <p className="footer-copy">© 2026 ArtyFrenzy. All rights reserved.</p>
      </footer>

      {/* ── Art Detail Modal ── */}
      {selectedArt && (
        <div className="modal-overlay" onClick={() => setSelectedArt(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedArt(null)}>✕</button>
            <div className="modal-content">
              <div className="modal-img"><img src={selectedArt.imageUrl} alt={selectedArt.title} /></div>
              <div className="modal-info">
                <span className="art-category">{selectedArt.category}</span>
                <h2 className="modal-title">{selectedArt.title}</h2>
                <p className="modal-artist">
                  by{" "}
                  <button className="artist-link" onClick={() => { setSelectedArt(null); setSelectedArtist(selectedArt.artist); }}>
                    {selectedArt.artist}
                  </button>
                </p>
                <p className="modal-desc">{selectedArt.description}</p>
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
                <ReviewSection artworkId={selectedArt.id} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Cart Drawer ── */}
      {cartOpen && (
        <div className="cart-overlay" onClick={() => setCartOpen(false)}>
          <div className="cart-drawer" onClick={e => e.stopPropagation()}>
            <div className="cart-header">
              <h3>Your Cart ({cart.length})</h3>
              <button onClick={() => setCartOpen(false)}>✕</button>
            </div>
            {cart.length === 0 ? (
              <div className="cart-empty"><span>🎨</span><p>Your cart is empty.<br />Start collecting art!</p></div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(item => (
                    <div className="cart-item" key={item.id}>
                      <img src={item.imageUrl} alt={item.title} />
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
                  <div className="cart-total"><span>Total</span><strong>₹{total.toLocaleString()}</strong></div>
                  <button className="btn-primary full" onClick={() => setCheckoutOpen(true)}>Proceed to Checkout</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <RecentlyViewedProvider>
          <AppInner />
        </RecentlyViewedProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}