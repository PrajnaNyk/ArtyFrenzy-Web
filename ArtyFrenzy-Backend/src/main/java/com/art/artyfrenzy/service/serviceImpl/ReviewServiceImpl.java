package com.art.artyfrenzy.service.serviceImpl;

import com.art.artyfrenzy.model.Artwork;
import com.art.artyfrenzy.model.Review;
import com.art.artyfrenzy.model.User;
import com.art.artyfrenzy.repository.ArtworkRepository;
import com.art.artyfrenzy.repository.ReviewRepository;
import com.art.artyfrenzy.repository.UserRepository;
import com.art.artyfrenzy.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime; 
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ArtworkRepository artworkRepository;

    @Override
    public List<Review> getReviewsByArtwork(Long artworkId) {
        return reviewRepository.findByArtworkIdOrderByCreatedAtDesc(artworkId);
    }

    @Override
    public Review addReview(Long userId, Long artworkId, Integer rating, String comment) {
        if (reviewRepository.existsByUserIdAndArtworkId(userId, artworkId)) {
            throw new RuntimeException("You have already reviewed this artwork!");
        }
        if (rating < 1 || rating > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Artwork artwork = artworkRepository.findById(artworkId)
                .orElseThrow(() -> new RuntimeException("Artwork not found"));

        return reviewRepository.save(
                Review.builder()
                        .user(user)
                        .artwork(artwork)
                        .rating(rating)
                        .comment(comment)
                        .createdAt(LocalDateTime.now()) // <-- EXPLICITLY SET IT HERE
                        .build()
        );
    }

    @Override
    public void deleteReview(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only delete your own reviews!");
        }
        reviewRepository.deleteById(reviewId);
    }
}