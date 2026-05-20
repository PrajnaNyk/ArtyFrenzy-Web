import { useRecentlyViewed } from "../context/RecentlyViewedContext";

export default function RecentlyViewed({ onSelectArt }) {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();

  // Don't render the section if there are no recently viewed items
  if (!recentlyViewed || recentlyViewed.length === 0) return null;

  return (
    <section style={{ padding: "60px 60px 40px", background: "#F9F5EF" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <p style={{ fontSize: "13px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#C9963A", fontWeight: 500, marginBottom: "8px" }}>
            ✦ Recently Viewed
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 300, color: "#1C1917" }}>
            Pick Up Where You Left Off
          </h2>
        </div>
        <button 
          onClick={clearRecentlyViewed}
          style={{
            background: "none",
            border: "1.5px solid rgba(44,40,37,0.15)",
            padding: "8px 18px",
            borderRadius: "50px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            color: "#7C7168",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
          onMouseOver={e => e.target.style.borderColor = "#1C1917"}
          onMouseOut={e => e.target.style.borderColor = "rgba(44,40,37,0.15)"}
        >
          Clear
        </button>
      </div>

      <div style={{ display: "flex", gap: "24px", overflowX: "auto", paddingBottom: "16px" }}>
        {recentlyViewed.map(art => (
          <div 
            key={art.id} 
            onClick={() => onSelectArt(art)}
            style={{
              minWidth: "220px",
              background: "#FFFDF9",
              borderRadius: "16px",
              border: "1px solid rgba(44,40,37,0.08)",
              overflow: "hidden",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s"
            }}
            onMouseOver={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(28,25,23,0.1)"; }}
            onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ width: "220px", height: "180px", overflow: "hidden" }}>
              <img 
                src={art.imageUrl || "https://via.placeholder.com/220x180?text=Art"} 
                alt={art.title}
                onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/220x180?text=Art" }}
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }}
              />
            </div>
            <div style={{ padding: "16px" }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 400, color: "#1C1917", marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {art.title}
              </h3>
              <p style={{ fontSize: "12px", color: "#7C7168", marginBottom: "8px" }}>
                by {art.artist || "Unknown"}
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 600, color: "#1C1917" }}>
                ₹{art.price?.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}