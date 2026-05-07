import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../auth/AuthContext";
import "./WishlistPage.css";

export default function WishlistPage({ onAddToCart, cart, onClose }) {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-empty">
          <span>🔐</span>
          <h3>Please sign in</h3>
          <p>Sign in to view and manage your wishlist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <div>
          <p className="wishlist-eyebrow">✦ Your Collection</p>
          <h2 className="wishlist-title">Wishlist</h2>
          <p className="wishlist-count">{wishlist.length} {wishlist.length === 1 ? "artwork" : "artworks"} saved</p>
        </div>
        {wishlist.length > 0 && (
          <button className="wishlist-clear-btn" onClick={clearWishlist}>Clear all</button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <span>♡</span>
          <h3>Your wishlist is empty</h3>
          <p>Save artworks you love by clicking the heart icon.</p>
          <button className="btn-primary" onClick={onClose}>Browse Gallery</button>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map(art => (
            <div className="wishlist-card" key={art.id}>
              <div className="wishlist-card-img">
                <img src={art.image} alt={art.title} />
                <button className="wishlist-remove-btn" onClick={() => removeFromWishlist(art.id)}>✕</button>
              </div>
              <div className="wishlist-card-info">
                <span className="wishlist-card-category">{art.category}</span>
                <h3 className="wishlist-card-title">{art.title}</h3>
                <p className="wishlist-card-artist">by {art.artist}</p>
                <div className="wishlist-card-footer">
                  <span className="wishlist-card-price">₹{art.price.toLocaleString()}</span>
                  <button
                    className="wishlist-add-cart-btn"
                    onClick={() => onAddToCart(art)}
                  >
                    {cart && cart.find(i => i.id === art.id) ? "✓ In Cart" : "+ Cart"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}