import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { paymentAPI } from "../services/api";

export default function UserOrders({ onClose }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await paymentAPI.getUserOrders(user.id);
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: "40px", textAlign: "center", color: "#7C7168" }}>Loading orders...</div>;

  return (
    <div style={{ padding: "32px" }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", marginBottom: "24px", color: "#1C1917" }}>
        My Orders
      </h2>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#7C7168" }}>
          <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}>📦</span>
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {orders.map(order => (
            <div key={order.id} style={{ background: "#FFFDF9", border: "1px solid rgba(44,40,37,0.08)", borderRadius: "14px", padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", borderBottom: "1px solid rgba(44,40,37,0.06)", paddingBottom: "12px" }}>
                <div>
                  <p style={{ fontSize: "12px", color: "#7C7168" }}>Order ID</p>
                  <p style={{ fontSize: "14px", fontWeight: 500 }}>#{order.razorpayOrderId || order.id}</p>
                </div>
                <div>
                  <p style={{ fontSize: "12px", color: "#7C7168" }}>Date</p>
                  <p style={{ fontSize: "14px", fontWeight: 500 }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p style={{ fontSize: "12px", color: "#7C7168" }}>Status</p>
                  <span style={{ 
                    background: order.status === "PAID" ? "#E8F5E9" : "#FFEBEE", 
                    color: order.status === "PAID" ? "#2E7D32" : "#C62828",
                    padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 500 
                  }}>
                    {order.status}
                  </span>
                </div>
                <div>
                  <p style={{ fontSize: "12px", color: "#7C7168" }}>Total</p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 600 }}>
                    ₹{order.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Items inside the order */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {order.items && order.items.map(item => (
                  <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <img 
                      src={item.artwork?.imageUrl || "https://via.placeholder.com/60"} 
                      alt={item.artwork?.title} 
                      style={{ width: "60px", height: "60px", borderRadius: "8px", objectFit: "cover", border: "1px solid rgba(44,40,37,0.08)" }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 500, fontSize: "14px", color: "#1C1917" }}>{item.artwork?.title || "Artwork"}</p>
                      <p style={{ fontSize: "12px", color: "#7C7168" }}>by {item.artwork?.artist || "Unknown"}</p>
                    </div>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "18px", color: "#1C1917" }}>
                      ₹{item.price?.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}