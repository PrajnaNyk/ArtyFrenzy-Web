package com.art.artyfrenzy.service;

import com.art.artyfrenzy.model.Wishlist;

import java.util.List;

public interface WishlistService {
    List<Wishlist> getUserWishlist(Long userId);
    Wishlist addToWishlist(Long userId, Long artworkId);
    void removeFromWishlist(Long userId, Long artworkId);
    boolean isWishlisted(Long userId, Long artworkId);
}