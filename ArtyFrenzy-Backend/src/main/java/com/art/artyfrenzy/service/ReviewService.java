package com.art.artyfrenzy.service;

import com.art.artyfrenzy.model.Review;

import java.util.List;

public interface ReviewService {
    List<Review> getReviewsByArtwork(Long artworkId);
    Review addReview(Long userId, Long artworkId, Integer rating, String comment);
    void deleteReview(Long reviewId, Long userId);
}