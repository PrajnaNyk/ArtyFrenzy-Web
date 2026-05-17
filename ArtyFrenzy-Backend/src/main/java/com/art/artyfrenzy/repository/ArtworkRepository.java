package com.art.artyfrenzy.repository;

import com.art.artyfrenzy.model.Artwork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArtworkRepository extends JpaRepository<Artwork, Long> {
    
    List<Artwork> findByStatus(String status); 
    List<Artwork> findByCategory(String category);
    List<Artwork> findByArtistContainingIgnoreCase(String artist);
    List<Artwork> findByTitleContainingIgnoreCase(String title);
}