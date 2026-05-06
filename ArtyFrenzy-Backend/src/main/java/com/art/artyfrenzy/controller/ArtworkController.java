package com.art.artyfrenzy.controller;

import com.art.artyfrenzy.model.Artwork;
import com.art.artyfrenzy.service.ArtworkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/artworks")
@RequiredArgsConstructor
public class ArtworkController {

    private final ArtworkService artworkService;

    // GET all artworks (public)
    @GetMapping
    public ResponseEntity<List<Artwork>> getAllArtworks() {
        return ResponseEntity.ok(artworkService.getAvailableArtworks());
    }

    // GET artwork by id (public)
    @GetMapping("/{id}")
    public ResponseEntity<Artwork> getArtworkById(@PathVariable Long id) {
        return ResponseEntity.ok(artworkService.getArtworkById(id));
    }

    // GET artworks by category (public)
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Artwork>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(artworkService.getArtworksByCategory(category));
    }

    // POST create artwork (admin only)
    @PostMapping
    public ResponseEntity<Artwork> createArtwork(@RequestBody Artwork artwork) {
        return ResponseEntity.ok(artworkService.createArtwork(artwork));
    }

    // PUT update artwork (admin only)
    @PutMapping("/{id}")
    public ResponseEntity<Artwork> updateArtwork(@PathVariable Long id, @RequestBody Artwork artwork) {
        return ResponseEntity.ok(artworkService.updateArtwork(id, artwork));
    }

    // DELETE artwork (admin only)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArtwork(@PathVariable Long id) {
        artworkService.deleteArtwork(id);
        return ResponseEntity.noContent().build();
    }
}