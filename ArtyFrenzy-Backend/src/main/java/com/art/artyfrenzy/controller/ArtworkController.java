package com.art.artyfrenzy.controller;

import com.art.artyfrenzy.model.Artwork;
import com.art.artyfrenzy.service.ArtworkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/artworks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ArtworkController {

    private final ArtworkService artworkService;

    // PUBLIC - Only returns Available artworks
    @GetMapping
    public ResponseEntity<List<Artwork>> getAvailableArtworks() {
        return ResponseEntity.ok(artworkService.getAvailableArtworks());
    }

    // ADMIN - Returns ALL artworks (Available + Sold)
    @GetMapping("/admin/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<Artwork>> getAllArtworksForAdmin() {
        return ResponseEntity.ok(artworkService.getAllArtworks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Artwork> getArtworkById(@PathVariable Long id) {
        return ResponseEntity.ok(artworkService.getArtworkById(id));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Artwork>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(artworkService.getArtworksByCategory(category));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Artwork> createArtwork(@RequestBody Artwork artwork) {
        return ResponseEntity.ok(artworkService.createArtwork(artwork));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Artwork> updateArtwork(@PathVariable Long id, @RequestBody Artwork artwork) {
        return ResponseEntity.ok(artworkService.updateArtwork(id, artwork));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteArtwork(@PathVariable Long id) {
        artworkService.deleteArtwork(id);
        return ResponseEntity.noContent().build();
    }
}