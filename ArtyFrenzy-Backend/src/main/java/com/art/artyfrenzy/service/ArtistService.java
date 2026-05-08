package com.art.artyfrenzy.service;

import com.art.artyfrenzy.model.Artist;

import java.util.List;

public interface ArtistService {
    List<Artist> getAllArtists();
    Artist getArtistById(Long id);
    Artist getArtistByName(String name);
    Artist createArtist(Artist artist);
    Artist updateArtist(Long id, Artist artist);
    void deleteArtist(Long id);
}