package com.art.artyfrenzy.controller;

import com.art.artyfrenzy.model.Review;
import com.art.artyfrenzy.service.ReviewService;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<Review> addReview(@RequestBody Map<String, Object> body) {
        Long userId = Long.valueOf(body.get("userId").toString());
        Long artworkId = Long.valueOf(body.get("artworkId").toString());
        Integer rating = Integer.valueOf(body.get("rating").toString());
        String comment = body.get("comment").toString();
        return ResponseEntity.ok(reviewService.addReview(userId, artworkId, rating, comment));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long reviewId,
            @RequestParam Long userId) {
        reviewService.deleteReview(reviewId, userId);
        return ResponseEntity.noContent().build();
    }
}