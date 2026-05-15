import { createContext, useContext, useState, useEffect } from "react";
import { wishlistAPI } from "../services/api";
import { useAuth } from "../auth/AuthContext";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user, isLoggedIn } = useAuth();
  
  // ── USER-SPECIFIC WISHLIST LOGIC ──
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist when user logs in
  useEffect(() => {
    if (isLoggedIn && user?.id) {
      try {
        const savedWishlist = JSON.parse(localStorage.getItem(`af_wishlist_${user.id}`)) || [];
        setWishlist(savedWishlist);
      } catch {
        setWishlist([]);
      }
    } else {
      setWishlist([]); // Clear UI when logged out
    }
  }, [isLoggedIn, user?.id]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isLoggedIn && user?.id) {
      localStorage.setItem(`af_wishlist_${user.id}`, JSON.stringify(wishlist));
    }
  }, [wishlist, isLoggedIn, user?.id]);

  // Fetch from backend when user logs in (optional, syncs database)
  useEffect(() => {
    if (isLoggedIn && user?.id) {
      fetchWishlist();
    }
  }, [isLoggedIn, user]);

  const fetchWishlist = async () => {
    try {
      const res = await wishlistAPI.getWishlist(user.id);
      const backendWishlist = res.data.map(item => item.artwork);
      setWishlist(backendWishlist); // This will also sync to localStorage via useEffect
    } catch (err) {
      console.error("Failed to fetch wishlist from backend, using local data:", err);
    }
  };

  const addToWishlist = async (artwork) => {
    if (wishlist.some(i => i.id === artwork.id)) return; // Prevent duplicates
    setWishlist(prev => [...prev, artwork]); // Update UI instantly
    
    if (isLoggedIn && user?.id) {
      try { await wishlistAPI.add(user.id, artwork.id); } 
      catch (err) { console.error("Failed to sync wishlist to backend:", err); }
    }
  };

  const removeFromWishlist = async (artworkId) => {
    setWishlist(prev => prev.filter(i => i.id !== artworkId)); // Update UI instantly
    
    if (isLoggedIn && user?.id) {
      try { await wishlistAPI.remove(user.id, artworkId); } 
      catch (err) { console.error("Failed to sync wishlist removal to backend:", err); }
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