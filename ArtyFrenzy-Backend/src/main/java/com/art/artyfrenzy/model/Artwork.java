package com.art.artyfrenzy.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "artworks")
public class Artwork {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String artist;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private String category;

    @Column(length = 1000)
    private String description;

    @Column
    private String imageUrl;

    @Column
    private String tag;

    @Column(nullable = false)
    private Boolean available = true;
}