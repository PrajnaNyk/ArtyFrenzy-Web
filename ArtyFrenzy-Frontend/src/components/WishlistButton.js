import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../auth/AuthContext";
import "./WishlistButton.css";

export default function WishlistButton({ artwork, onLoginRequired }) {
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();
  const { isLoggedIn } = useAuth();
  const wishlisted = isWishlisted(artwork.id);

  const handleClick = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      onLoginRequired && onLoginRequired();
      return;
    }
    wishlisted ? removeFromWishlist(artwork.id) : addToWishlist(artwork);
  };

  return (
    <button
      className={`wishlist-btn ${wishlisted ? "wishlisted" : ""}`}
      onClick={handleClick}
      title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      {wishlisted ? "♥" : "♡"}
    </button>
  );
}