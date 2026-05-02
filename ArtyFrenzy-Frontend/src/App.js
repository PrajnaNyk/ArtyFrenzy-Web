import { useState, useEffect, createContext, useContext } from "react";
import "./App.css";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const savedToken = localStorage.getItem("af_token");
    const savedUser = localStorage.getItem("af_user");
    if (savedToken && savedUser) setUser(JSON.parse(savedUser));
  }, []);
  const login = (userData, jwtToken) => {
    setUser(userData);
    localStorage.setItem("af_token", jwtToken);
    localStorage.setItem("af_user", JSON.stringify(userData));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("af_token");
    localStorage.removeItem("af_user");
  };
  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() { return useContext(AuthContext); }

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
    await new Promise(r => setTimeout(r, 1000));
    login({ name: "Art Lover", email: form.email }, "demo-token-123");
    setLoading(false);
    onClose();
  };
  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-art-stack">
          <div className="auth-art auth-art-1"><img src={artworks[0].image} alt="" /></div>
          <div className="auth-art auth-art-2"><img src={artworks[4].image} alt="" /></div>
          <div className="auth-art auth-art-3"><img src={artworks[2].image} alt="" /></div>
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
              <button type="button" className="auth-social-btn">GitHub</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function RegisterForm({ onSwitchToLogin, onClose }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); };
  const getStrength = (p) => { let s=0; if(p.length>=8)s++; if(/[A-Z]/.test(p))s++; if(/[0-9]/.test(p))s++; if(/[^A-Za-z0-9]/.test(p))s++; return s; };
  const strength = getStrength(form.password);
  const strengthLabel = ["","Weak","Fair","Good","Strong"][strength];
  const strengthColor = ["","#E24B4A","#EF9F27","#1D9E75","#0F6E56"][strength];
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm) { setError("Please fill in all fields."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    login({ name: form.name, email: form.email }, "demo-token-456");
    setLoading(false);
    onClose();
  };
  return (
    <div className="auth-page">
      <div className="auth-left auth-left-reg">
        <div className="auth-art-stack">
          <div className="auth-art auth-art-1"><img src={artworks[3].image} alt="" /></div>
          <div className="auth-art auth-art-2"><img src={artworks[6].image} alt="" /></div>
          <div className="auth-art auth-art-3"><img src={artworks[7].image} alt="" /></div>
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
                  <div className="strength-bar">{[1,2,3,4].map(i=><div key={i} className="strength-seg" style={{background: i<=strength ? strengthColor : "rgba(44,40,37,0.1)"}}/>)}</div>
                  <span className="strength-label" style={{color: strengthColor}}>{strengthLabel}</span>
                </div>
              )}
            </div>
            <div className="auth-field"><label className="auth-label">Confirm password</label><input className="auth-input" type={showPass ? "text" : "password"} name="confirm" placeholder="Re-enter your password" value={form.confirm} onChange={handleChange} /></div>
            <button className="auth-submit-btn" type="submit" disabled={loading}>{loading ? <span className="auth-spinner" /> : "Create account"}</button>
            <div className="auth-divider"><span>or sign up with</span></div>
            <div className="auth-social-btns">
              <button type="button" className="auth-social-btn">Google</button>
              <button type="button" className="auth-social-btn">GitHub</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

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

function AppInner() {
  const { user, logout, isLoggedIn } = useAuth();
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedArt, setSelectedArt] = useState(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const [toast, setToast] = useState("");
  const [authModal, setAuthModal] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered = activeCategory === "All" ? artworks : artworks.filter(a => a.category === activeCategory);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };
  const addToCart = (art) => {
    if (!isLoggedIn) { setAuthModal("login"); showToast("Please login to add items to cart!"); return; }
    setCart(prev => prev.find(i => i.id === art.id) ? prev : [...prev, { ...art }]);
    showToast(`"${art.title}" added to cart!`);
  };
  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const total = cart.reduce((s, i) => s + i.price, 0);
  const handleLogout = () => { logout(); setUserMenuOpen(false); showToast("Logged out successfully!"); };

  return (
    <div className="app">
      {toast && <div className="toast">{toast}</div>}
      {authModal && <AuthModal mode={authModal} onClose={() => setAuthModal(null)} />}

      <nav className={`navbar ${navScrolled ? "scrolled" : ""}`}>
        <div className="nav-logo"><span className="logo-icon">✦</span><span className="logo-text">ArtyFrenzy</span></div>
        <div className="nav-links"><a href="#gallery">Gallery</a><a href="#about">About</a></div>
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
                  <button className="dropdown-item">🎨 My Collection</button>
                  <button className="dropdown-item">📦 My Orders</button>
                  <button className="dropdown-item">⚙️ Settings</button>
                  <div className="user-dropdown-divider" />
                  <button className="dropdown-item dropdown-logout" onClick={handleLogout}>↩ Sign out</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-nav-btns">
              <button className="btn-nav-login" onClick={() => setAuthModal("login")}>Sign in</button>
              <button className="btn-nav-register" onClick={() => setAuthModal("register")}>Join free</button>
            </div>
          )}
          <button className="cart-btn" onClick={() => setCartOpen(true)}>
            <span>🛍</span><span>Cart</span>
            {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
          </button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-bg"><div className="blob blob1" /><div className="blob blob2" /><div className="blob blob3" /></div>
        <div className="hero-content">
          <p className="hero-eyebrow">✦ Curated Fine Art Marketplace</p>
          <h1 className="hero-title">Where Art Finds<br /><span className="hero-accent">Its Collector</span></h1>
          <p className="hero-sub">Discover original artworks by India's finest contemporary artists. Every piece tells a story — find yours.</p>
          <div className="hero-actions">
            <a href="#gallery" className="btn-primary">Explore Gallery</a>
            {!isLoggedIn && <button className="btn-ghost" onClick={() => setAuthModal("register")}>Join for Free</button>}
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

      <section className="gallery-section" id="gallery">
        <div className="section-header"><p className="section-eyebrow">✦ Our Collection</p><h2 className="section-title">Featured Artworks</h2></div>
        <div className="filter-bar">{categories.map(cat => <button key={cat} className={`filter-btn ${activeCategory===cat?"active":""}`} onClick={()=>setActiveCategory(cat)}>{cat}</button>)}</div>
        <div className="art-grid">
          {filtered.map((art, i) => (
            <div className="art-card" key={art.id} style={{animationDelay:`${i*0.07}s`}}>
              <div className="art-img-wrap" onClick={()=>setSelectedArt(art)}>
                <img src={art.image} alt={art.title} />
                <div className="art-overlay"><button className="view-btn">View Details</button></div>
                {art.tag && <span className="art-tag">{art.tag}</span>}
              </div>
              <div className="art-info">
                <span className="art-category">{art.category}</span>
                <h3 className="art-title">{art.title}</h3>
                <p className="art-artist">by {art.artist}</p>
                <div className="art-footer">
                  <span className="art-price">₹{art.price.toLocaleString()}</span>
                  <button className="add-cart-btn" onClick={()=>addToCart(art)}>{cart.find(i=>i.id===art.id)?"✓ Added":"+ Cart"}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-inner">
          <div className="about-text">
            <p className="section-eyebrow">✦ Our Story</p>
            <h2 className="section-title">Art Should Be<br />Accessible to All</h2>
            <p className="about-desc">ArtyFrenzy connects India's most talented artists directly with passionate art lovers, removing the gallery middleman.</p>
            <div className="about-features">
              <div className="feature"><span className="feature-icon">🎨</span><span>100% Original Artworks</span></div>
              <div className="feature"><span className="feature-icon">🔐</span><span>Secure & Verified Transactions</span></div>
              <div className="feature"><span className="feature-icon">🚚</span><span>Pan-India Delivery</span></div>
              <div className="feature"><span className="feature-icon">↩️</span><span>30-Day Return Policy</span></div>
            </div>
            {!isLoggedIn && <button className="btn-primary" style={{marginTop:"28px"}} onClick={()=>setAuthModal("register")}>Start Collecting →</button>}
          </div>
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80" alt="Artist at work" />
            <div className="about-badge"><span className="badge-num">12+</span><span className="badge-text">Years of<br/>Art Curation</span></div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-logo"><span className="logo-icon">✦</span><span className="logo-text">ArtyFrenzy</span></div>
        <p className="footer-tagline">Where art finds its collector.</p>
        <p className="footer-copy">© 2026 ArtyFrenzy. All rights reserved.</p>
      </footer>

      {selectedArt && (
        <div className="modal-overlay" onClick={()=>setSelectedArt(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <button className="modal-close" onClick={()=>setSelectedArt(null)}>✕</button>
            <div className="modal-content">
              <div className="modal-img"><img src={selectedArt.image} alt={selectedArt.title} /></div>
              <div className="modal-info">
                <span className="art-category">{selectedArt.category}</span>
                <h2 className="modal-title">{selectedArt.title}</h2>
                <p className="modal-artist">by {selectedArt.artist}</p>
                <p className="modal-desc">A stunning original artwork that brings life, color and emotion to any space. Hand-crafted with premium materials, certified original.</p>
                <div className="modal-details">
                  <div className="detail"><span>Medium</span><strong>Oil on Canvas</strong></div>
                  <div className="detail"><span>Size</span><strong>24" × 36"</strong></div>
                  <div className="detail"><span>Year</span><strong>2025</strong></div>
                  <div className="detail"><span>Delivery</span><strong>7–10 Days</strong></div>
                </div>
                <div className="modal-price">₹{selectedArt.price.toLocaleString()}</div>
                <button className="btn-primary full" onClick={()=>{addToCart(selectedArt);setSelectedArt(null);}}>
                  {cart.find(i=>i.id===selectedArt.id)?"✓ Already in Cart":"Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {cartOpen && (
        <div className="cart-overlay" onClick={()=>setCartOpen(false)}>
          <div className="cart-drawer" onClick={e=>e.stopPropagation()}>
            <div className="cart-header"><h3>Your Cart ({cart.length})</h3><button onClick={()=>setCartOpen(false)}>✕</button></div>
            {cart.length===0 ? (
              <div className="cart-empty"><span>🎨</span><p>Your cart is empty.<br/>Start collecting art!</p></div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(item=>(
                    <div className="cart-item" key={item.id}>
                      <img src={item.image} alt={item.title}/>
                      <div className="cart-item-info">
                        <p className="cart-item-title">{item.title}</p>
                        <p className="cart-item-artist">by {item.artist}</p>
                        <p className="cart-item-price">₹{item.price.toLocaleString()}</p>
                      </div>
                      <button className="remove-btn" onClick={()=>removeFromCart(item.id)}>✕</button>
                    </div>
                  ))}
                </div>
                <div className="cart-footer">
                  <div className="cart-total"><span>Total</span><strong>₹{total.toLocaleString()}</strong></div>
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

export default function App() {
  return <AuthProvider><AppInner /></AuthProvider>;
}