import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import "./ReviewSection.css";

const initialReviews = {
  1: [
    { id: 1, name: "Ananya S.", rating: 5, comment: "Absolutely stunning piece! The colors are even more vibrant in person. Perfect addition to my living room.", date: "April 2026" },
    { id: 2, name: "Rohan M.", rating: 4, comment: "Beautiful artwork, delivered carefully packed. Very happy with the purchase!", date: "March 2026" },
  ],
  2: [
    { id: 1, name: "Priya K.", rating: 5, comment: "The landscape feels so alive. Meera Nair is truly gifted!", date: "April 2026" },
  ],
};

function StarRating({ rating, onRate, interactive = false }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          className={`star ${star <= (hovered || rating) ? "filled" : ""} ${interactive ? "interactive" : ""}`}
          onClick={() => interactive && onRate && onRate(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function ReviewSection({ artworkId }) {
  const { isLoggedIn, user } = useAuth();
  const [reviews, setReviews] = useState(initialReviews[artworkId] || []);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newReview.rating === 0) { setError("Please select a rating."); return; }
    if (!newReview.comment.trim()) { setError("Please write a review."); return; }

    const review = {
      id: Date.now(),
      name: user?.name || "Anonymous",
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
    };

    setReviews(prev => [review, ...prev]);
    setNewReview({ rating: 0, comment: "" });
    setSubmitted(true);
    setError("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="review-section">
      <div className="review-header">
        <h3 className="review-title">Reviews</h3>
        {reviews.length > 0 && (
          <div className="review-summary">
            <span className="review-avg">{avgRating}</span>
            <StarRating rating={Math.round(avgRating)} />
            <span className="review-total">({reviews.length} {reviews.length === 1 ? "review" : "reviews"})</span>
          </div>
        )}
      </div>

      {/* Write a review */}
      {isLoggedIn ? (
        <form className="review-form" onSubmit={handleSubmit}>
          <p className="review-form-label">Write a review</p>
          <StarRating
            rating={newReview.rating}
            onRate={(r) => setNewReview(prev => ({ ...prev, rating: r }))}
            interactive={true}
          />
          <textarea
            className="review-textarea"
            placeholder="Share your experience with this artwork..."
            value={newReview.comment}
            onChange={e => { setNewReview(prev => ({ ...prev, comment: e.target.value })); setError(""); }}
            rows={3}
          />
          {error && <p className="review-error">{error}</p>}
          {submitted && <p className="review-success">✓ Review submitted!</p>}
          <button className="review-submit-btn" type="submit">Submit Review</button>
        </form>
      ) : (
        <div className="review-login-prompt">
          <p>Sign in to leave a review</p>
        </div>
      )}

      {/* Reviews list */}
      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map(review => (
            <div className="review-item" key={review.id}>
              <div className="review-item-header">
                <div className="review-item-avatar">{review.name.charAt(0)}</div>
                <div>
                  <p className="review-item-name">{review.name}</p>
                  <StarRating rating={review.rating} />
                </div>
                <span className="review-item-date">{review.date}</span>
              </div>
              <p className="review-item-comment">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}