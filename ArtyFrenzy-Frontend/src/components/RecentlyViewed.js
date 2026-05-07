import { useRecentlyViewed } from "../context/RecentlyViewedContext";
import "./RecentlyViewed.css";

export default function RecentlyViewed({ onSelectArt }) {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();

  if (recentlyViewed.length === 0) return null;

  return (
    <section className="recently-viewed-section">
      <div className="recently-viewed-header">
        <div>
          <p className="recently-viewed-eyebrow">✦ Your History</p>
          <h3 className="recently-viewed-title">Recently Viewed</h3>
        </div>
        <button className="recently-viewed-clear" onClick={clearRecentlyViewed}>Clear</button>
      </div>
      <div className="recently-viewed-scroll">
        {recentlyViewed.map(art => (
          <div
            className="recently-viewed-card"
            key={art.id}
            onClick={() => onSelectArt(art)}
          >
            <div className="recently-viewed-img">
              <img src={art.image} alt={art.title} />
            </div>
            <div className="recently-viewed-info">
              <p className="recently-viewed-name">{art.title}</p>
              <p className="recently-viewed-artist">by {art.artist}</p>
              <p className="recently-viewed-price">₹{art.price.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}