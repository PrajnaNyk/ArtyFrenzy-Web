import { createContext, useContext, useState, useEffect } from "react";
import { wishlistAPI } from "../services/api";
import { useAuth } from "../auth/AuthContext";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user, isLoggedIn } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist from backend when user logs in
  useEffect(() => {
    if (isLoggedIn && user?.id) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [isLoggedIn, user]);

  const fetchWishlist = async () => {
    try {
      const res = await wishlistAPI.getWishlist(user.id);
      // Extract artwork objects from wishlist items
      setWishlist(res.data.map(item => item.artwork));
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    }
  };

  const addToWishlist = async (artwork) => {
    try {
      await wishlistAPI.add(user.id, artwork.id);
      setWishlist(prev => [...prev, artwork]);
    } catch (err) {
      console.error("Failed to add to wishlist:", err);
    }
  };

  const removeFromWishlist = async (artworkId) => {
    try {
      await wishlistAPI.remove(user.id, artworkId);
      setWishlist(prev => prev.filter(i => i.id !== artworkId));
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
    }
  };

  const isWishlisted = (artworkId) => wishlist.some(i => i.id === artworkId);

  const clearWishlist = () => setWishlist([]);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isWishlisted, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}