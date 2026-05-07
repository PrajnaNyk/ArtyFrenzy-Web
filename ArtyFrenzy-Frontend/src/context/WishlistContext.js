import { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("af_wishlist");
    if (saved) setWishlist(JSON.parse(saved));
  }, []);

  const saveToStorage = (items) => {
    localStorage.setItem("af_wishlist", JSON.stringify(items));
  };

  const addToWishlist = (artwork) => {
    setWishlist(prev => {
      if (prev.find(i => i.id === artwork.id)) return prev;
      const updated = [...prev, artwork];
      saveToStorage(updated);
      return updated;
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist(prev => {
      const updated = prev.filter(i => i.id !== id);
      saveToStorage(updated);
      return updated;
    });
  };

  const isWishlisted = (id) => wishlist.some(i => i.id === id);

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem("af_wishlist");
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isWishlisted, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}