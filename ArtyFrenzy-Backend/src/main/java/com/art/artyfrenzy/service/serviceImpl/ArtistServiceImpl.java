package com.art.artyfrenzy.service.serviceImpl;

import com.art.artyfrenzy.model.Artist;
import com.art.artyfrenzy.repository.ArtistRepository;
import com.art.artyfrenzy.service.ArtistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ArtistServiceImpl implements ArtistService {

    private final ArtistRepository artistRepository;

    @Override
    public List<Artist> getAllArtists() {
        return artistRepository.findAll();
    }

    @Override
    public Artist getArtistById(Long id) {
        return artistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artist not found with id: " + id));
    }

    @Override
    public Artist getArtistByName(String name) {
        return artistRepository.findByNameIgnoreCase(name)
                .orElseThrow(() -> new RuntimeException("Artist not found: " + name));
    }

    @Override
    public Artist createArtist(Artist artist) {
        return artistRepository.save(artist);
    }

    @Override
    public Artist updateArtist(Long id, Artist updated) {
        Artist existing = getArtistById(id);
        existing.setName(updated.getName());
        existing.setLocation(updated.getLocation());
        existing.setBio(updated.getBio());
        existing.setStyle(updated.getStyle());
        existing.setMedium(updated.getMedium());
        existing.setInstagram(updated.getInstagram());
        existing.setWebsite(updated.getWebsite());
        existing.setAvatarColor(updated.getAvatarColor()); // <-- ADDED THIS LINE
        return artistRepository.save(existing);
    }

    @Override
    public void deleteArtist(Long id) {
        artistRepository.deleteById(id);
    }
}