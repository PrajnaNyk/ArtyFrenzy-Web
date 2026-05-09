import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { reviewAPI } from "../services/api";
import "./ReviewSection.css";

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
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [artworkId]);

  const fetchReviews = async () => {
    try {
      const res = await reviewAPI.getByArtwork(artworkId);
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newReview.rating === 0) { setError("Please select a rating."); return; }
    if (!newReview.comment.trim()) { setError("Please write a review."); return; }
    setLoading(true);
    try {
      await reviewAPI.add(user.id, artworkId, newReview.rating, newReview.comment);
      setNewReview({ rating: 0, comment: "" });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await reviewAPI.delete(reviewId, user.id);
      fetchReviews();
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
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
          {success && <p className="review-success">✓ Review submitted!</p>}
          <button className="review-submit-btn" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      ) : (
        <div className="review-login-prompt">
          <p>Sign in to leave a review</p>
        </div>
      )}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map(review => (
            <div className="review-item" key={review.id}>
              <div className="review-item-header">
                <div className="review-item-avatar">{review.user?.name?.charAt(0) || "U"}</div>
                <div>
                  <p className="review-item-name">{review.user?.name || "Anonymous"}</p>
                  <StarRating rating={review.rating} />
                </div>
                <span className="review-item-date">
                  {new Date(review.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                </span>
                {user?.id === review.user?.id && (
                  <button className="review-delete-btn" onClick={() => handleDelete(review.id)}>✕</button>
                )}
              </div>
              <p className="review-item-comment">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}