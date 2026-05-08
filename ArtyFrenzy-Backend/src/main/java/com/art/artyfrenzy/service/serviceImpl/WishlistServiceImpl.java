package com.art.artyfrenzy.service.serviceImpl;

import com.art.artyfrenzy.model.Artwork;
import com.art.artyfrenzy.model.User;
import com.art.artyfrenzy.model.Wishlist;
import com.art.artyfrenzy.repository.ArtworkRepository;
import com.art.artyfrenzy.repository.UserRepository;
import com.art.artyfrenzy.repository.WishlistRepository;
import com.art.artyfrenzy.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ArtworkRepository artworkRepository;

    @Override
    public List<Wishlist> getUserWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId);
    }

    @Override
    public Wishlist addToWishlist(Long userId, Long artworkId) {
        if (wishlistRepository.existsByUserIdAndArtworkId(userId, artworkId)) {
            throw new RuntimeException("Artwork already in wishlist!");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Artwork artwork = artworkRepository.findById(artworkId)
                .orElseThrow(() -> new RuntimeException("Artwork not found"));

        return wishlistRepository.save(
                Wishlist.builder().user(user).artwork(artwork).build()
        );
    }

    @Override
    @Transactional
    public void removeFromWishlist(Long userId, Long artworkId) {
        wishlistRepository.deleteByUserIdAndArtworkId(userId, artworkId);
    }

    @Override
    public boolean isWishlisted(Long userId, Long artworkId) {
        return wishlistRepository.existsByUserIdAndArtworkId(userId, artworkId);
    }
}