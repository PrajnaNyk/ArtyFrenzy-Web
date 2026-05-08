package com.art.artyfrenzy.controller;

import com.art.artyfrenzy.model.Wishlist;
import com.art.artyfrenzy.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<Wishlist>> getUserWishlist(@PathVariable Long userId) {
        return ResponseEntity.ok(wishlistService.getUserWishlist(userId));
    }

    @PostMapping
    public ResponseEntity<Wishlist> addToWishlist(@RequestBody Map<String, Long> body) {
        return ResponseEntity.ok(
                wishlistService.addToWishlist(body.get("userId"), body.get("artworkId"))
        );
    }

    @DeleteMapping
    public ResponseEntity<Void> removeFromWishlist(@RequestBody Map<String, Long> body) {
        wishlistService.removeFromWishlist(body.get("userId"), body.get("artworkId"));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> isWishlisted(
            @RequestParam Long userId,
            @RequestParam Long artworkId) {
        return ResponseEntity.ok(wishlistService.isWishlisted(userId, artworkId));
    }
}