package com.art.artyfrenzy.service;

import com.art.artyfrenzy.model.Artwork;

import java.util.List;

public interface ArtworkService {

    List<Artwork> getAllArtworks();

    List<Artwork> getAvailableArtworks();

    Artwork getArtworkById(Long id);

    List<Artwork> getArtworksByCategory(String category);

    Artwork createArtwork(Artwork artwork);

    Artwork updateArtwork(Long id, Artwork artwork);

    void deleteArtwork(Long id);
}