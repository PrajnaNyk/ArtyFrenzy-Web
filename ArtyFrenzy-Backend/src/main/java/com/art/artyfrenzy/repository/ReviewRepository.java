package com.art.artyfrenzy.repository;

import com.art.artyfrenzy.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByArtworkIdOrderByCreatedAtDesc(Long artworkId);
    boolean existsByUserIdAndArtworkId(Long userId, Long artworkId);

    // ADD THIS: Custom delete method
    void deleteByArtworkId(Long artworkId);
}