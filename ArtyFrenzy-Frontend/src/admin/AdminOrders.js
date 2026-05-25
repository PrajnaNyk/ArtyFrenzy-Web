import { useState, useEffect } from "react";
import { paymentAPI } from "../services/api";
import "./AdminArtworks.css"; // Reusing the same table CSS

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await paymentAPI.getAllOrders();
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await paymentAPI.updateStatus(id, newStatus);
      fetchOrders(); // Refresh table
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update order status.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID": return "#E8F5E9"; case "PAID_COLOR": return "#2E7D32";
      case "SHIPPED": return "#E3F2FD"; case "SHIPPED_COLOR": return "#1565C0";
      case "DELIVERED": return "#F3E5F5"; case "DELIVERED_COLOR": return "#7B1FA2";
      case "PENDING": return "#FFF3E0"; case "PENDING_COLOR": return "#E65100";
      case "FAILED": return "#FFEBEE"; case "FAILED_COLOR": return "#C62828";
      default: return "#F5F5F5";
    }
  };

  if (loading) return <div className="admin-loading">Loading orders...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 400 }}>
            Manage Orders
          </h2>
          <p style={{ fontSize: "14px", color: "#7C7168", marginTop: "4px" }}>
            {orders.length} total orders
          </p>
        </div>
      </div>

      <div className="admin-table-container">
        {orders.length === 0 ? (
          <div className="admin-empty">No orders yet.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td style={{ fontSize: "13px", color: "#7C7168" }}>
                    #{order.razorpayOrderId ? order.razorpayOrderId.substring(0, 12) + "..." : order.id}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{order.user?.name}</div>
                    <div style={{ fontSize: "12px", color: "#7C7168" }}>{order.user?.email}</div>
                  </td>
                  <td>
                    {order.items?.map(item => (
                      <div key={item.id} style={{ fontSize: "13px" }}>
                        {item.artwork?.title || "Artwork"} x1
                      </div>
                    ))}
                  </td>
                  <td style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "18px" }}>
                    ₹{order.totalAmount?.toLocaleString()}
                  </td>
                  <td style={{ fontSize: "13px" }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <span 
                      className="status-badge" 
                      style={{ 
                        background: getStatusColor(order.status), 
                        color: getStatusColor(order.status + "_COLOR") 
                      }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <select 
                      className="admin-form-input" 
                      style={{ padding: "6px 10px", fontSize: "13px", width: "130px" }}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PAID">PAID</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="FAILED">FAILED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}