import { createContext, useContext, useState, useEffect } from "react";

const RecentlyViewedContext = createContext(null);

export function RecentlyViewedProvider({ children }) {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("af_recently_viewed");
    if (saved) setRecentlyViewed(JSON.parse(saved));
  }, []);

  const addToRecentlyViewed = (artwork) => {
    setRecentlyViewed(prev => {
      // Remove if already exists, then add to front
      const filtered = prev.filter(i => i.id !== artwork.id);
      const updated = [artwork, ...filtered].slice(0, 6); // Keep max 6
      localStorage.setItem("af_recently_viewed", JSON.stringify(updated));
      return updated;
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    localStorage.removeItem("af_recently_viewed");
  };

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewed, addToRecentlyViewed, clearRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  return useContext(RecentlyViewedContext);
}