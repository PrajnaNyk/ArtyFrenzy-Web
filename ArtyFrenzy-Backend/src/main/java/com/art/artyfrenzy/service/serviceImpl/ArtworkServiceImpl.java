package com.art.artyfrenzy.service.serviceImpl;

import com.art.artyfrenzy.model.Artwork;
import com.art.artyfrenzy.repository.ArtworkRepository;
import com.art.artyfrenzy.repository.ReviewRepository;
import com.art.artyfrenzy.repository.WishlistRepository;
import com.art.artyfrenzy.service.ArtworkService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ArtworkServiceImpl implements ArtworkService {

    private final ArtworkRepository artworkRepository;
    private final ReviewRepository reviewRepository;  
    private final WishlistRepository wishlistRepository; 

    @Override
    public List<Artwork> getAllArtworks() {
        return artworkRepository.findAll(); // Returns BOTH Available and Sold
    }

    @Override
    public List<Artwork> getAvailableArtworks() {
        return artworkRepository.findByStatus("Available"); // Returns ONLY Available
    }

    @Override
    public Artwork getArtworkById(Long id) {
        return artworkRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artwork not found with id: " + id));
    }

    @Override
    public List<Artwork> getArtworksByCategory(String category) {
        return artworkRepository.findByCategory(category);
    }

    @Override
    public Artwork createArtwork(Artwork artwork) {
        return artworkRepository.save(artwork);
    }

    @Override
    public Artwork updateArtwork(Long id, Artwork updatedArtwork) {
        Artwork existing = getArtworkById(id);
        existing.setTitle(updatedArtwork.getTitle());
        existing.setArtist(updatedArtwork.getArtist());
        existing.setPrice(updatedArtwork.getPrice());
        existing.setCategory(updatedArtwork.getCategory());
        existing.setDescription(updatedArtwork.getDescription());
        existing.setImageUrl(updatedArtwork.getImageUrl());
        existing.setTag(updatedArtwork.getTag());
        existing.setStatus(updatedArtwork.getStatus()); // Ensure status is updated
        return artworkRepository.save(existing);
    }


    @Override
    public void deleteArtwork(Long id) {
        // 1. First, delete all reviews linked to this artwork
        reviewRepository.deleteByArtworkId(id);
        
        // 2. Second, delete all wishlist items linked to this artwork
        wishlistRepository.deleteByArtworkId(id);

        // 3. Finally, delete the artwork itself
        artworkRepository.deleteById(id);
    }
}