package com.art.artyfrenzy.controller;

import com.art.artyfrenzy.model.Review;
import com.art.artyfrenzy.service.ReviewService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/artwork/{artworkId}")
    public ResponseEntity<List<Review>> getReviewsByArtwork(@PathVariable Long artworkId) {
        return ResponseEntity.ok(reviewService.getReviewsByArtwork(artworkId));
    }

    @PostMapping
    public ResponseEntity<?> addReview(@RequestBody Map<String, Object> body) {
        try {
            // Safely extract data to prevent NullPointerException
            Object userIdObj = body.get("userId");
            Object artworkIdObj = body.get("artworkId");
            Object ratingObj = body.get("rating");
            Object commentObj = body.get("comment");

            if (userIdObj == null || artworkIdObj == null || ratingObj == null || commentObj == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Missing required fields. Please log in again."));
            }

            Long userId = Long.valueOf(userIdObj.toString());
            Long artworkId = Long.valueOf(artworkIdObj.toString());
            Integer rating = Integer.valueOf(ratingObj.toString());
            String comment = commentObj.toString();

            Review review = reviewService.addReview(userId, artworkId, rating, comment);
            return ResponseEntity.ok(review);
            
        } catch (RuntimeException e) {
            // This catches your "You have already reviewed" error and sends it cleanly
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "An unexpected error occurred."));
        }
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long reviewId,
            @RequestParam Long userId) {
        reviewService.deleteReview(reviewId, userId);
        return ResponseEntity.noContent().build();
    }
}