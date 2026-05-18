import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { paymentAPI } from "../services/api";
import "./CheckoutPage.css";

export default function CheckoutPage({ cart, onClose, onPaymentSuccess }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = cart.reduce((s, i) => s + i.price, 0);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      // Step 1 — Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Failed to load Razorpay. Check your internet connection.");
        setLoading(false);
        return;
      }

      // Calculate total WITH GST so Razorpay charges the correct amount
      const totalWithGst = Math.round(total * 1.18);

      // Step 2 — Create order on backend
      const orderRes = await paymentAPI.createOrder({
        userId: user.id,
        artworkIds: cart.map(item => item.id),
        totalAmount: totalWithGst, 
      });

      const { razorpayOrderId, amount, currency, keyId } = orderRes.data;

      // Step 3 — Open Razorpay checkout
      const options = {
        key: keyId, // Ensure this is your rzp_test_ key from the backend
        amount: amount * 100, // Amount in paise
        currency: currency,
        name: "ArtyFrenzy",
        description: `Purchase of ${cart.length} artwork${cart.length > 1 ? "s" : ""}`,
        order_id: razorpayOrderId,
        
        // ✅ FIX: HIDE QR CODES, UPI & WALLETS - Only show Card for easy testing!
        method: {
          card: true,
          netbanking: true,
          upi: false,
          wallet: false,
          emi: false,
        },
        
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: "#1C1917" }, // Matched your website dark theme
        
        handler: async (response) => {
          // Step 4 — Verify payment on backend
          try {
            await paymentAPI.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            onPaymentSuccess();
          } catch (err) {
            setError(err.response?.data?.message || "Payment verification failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError("Payment cancelled.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Payment failed. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-box" onClick={e => e.stopPropagation()}>
        <button className="checkout-close" onClick={onClose}>✕</button>

        <div className="checkout-header">
          <p className="checkout-eyebrow">✦ Secure Checkout</p>
          <h2 className="checkout-title">Order Summary</h2>
        </div>

        {/* Cart Items */}
        <div className="checkout-items">
          {cart.map(item => (
            <div className="checkout-item" key={item.id}>
              <img src={item.imageUrl} alt={item.title} className="checkout-item-img" />
              <div className="checkout-item-info">
                <p className="checkout-item-title">{item.title}</p>
                <p className="checkout-item-artist">by {item.artist}</p>
              </div>
              <span className="checkout-item-price">₹{item.price.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Order Details */}
        <div className="checkout-summary">
          <div className="checkout-summary-row">
            <span>Subtotal ({cart.length} item{cart.length > 1 ? "s" : ""})</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
          <div className="checkout-summary-row">
            <span>Shipping</span>
            <span className="checkout-free">Free</span>
          </div>
          <div className="checkout-summary-row">
            <span>Tax (18% GST)</span>
            <span>₹{Math.round(total * 0.18).toLocaleString()}</span>
          </div>
          <div className="checkout-divider" />
          <div className="checkout-summary-row checkout-total-row">
            <span>Total</span>
            <strong>₹{Math.round(total * 1.18).toLocaleString()}</strong>
          </div>
        </div>

        {/* Buyer Info */}
        <div className="checkout-buyer">
          <p className="checkout-buyer-label">Paying as</p>
          <p className="checkout-buyer-name">{user?.name}</p>
          <p className="checkout-buyer-email">{user?.email}</p>
        </div>

        {error && <div className="checkout-error">{error}</div>}

        {/* ✅ ADDED: Test Mode Instructions Banner */}
        <div style={{ background: "#FFF3E0", padding: "12px 16px", borderRadius: "10px", marginBottom: "16px", fontSize: "13px", color: "#E65100", textAlign: "center", border: "1px solid #FFE0B2" }}>
          🧪 <strong>Razorpay Test Mode:</strong> Use Card Number <strong>4111 1111 1111 1111</strong>, any future expiry, any CVV.
        </div>

        {/* Pay Button */}
        <button
          className="checkout-pay-btn"
          onClick={handlePayment}
          disabled={loading || cart.length === 0}
        >
          {loading ? (
            <span className="checkout-spinner" />
          ) : (
            <>
              <span>🔒</span>
              <span>Pay ₹{Math.round(total * 1.18).toLocaleString()} with Razorpay</span>
            </>
          )}
        </button>

        <p className="checkout-secure-note">
          🔐 Secured by Razorpay · 256-bit SSL encryption
        </p>
      </div>
    </div>
  );
}