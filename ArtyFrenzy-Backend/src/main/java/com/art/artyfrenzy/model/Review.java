package com.art.artyfrenzy.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "artwork_id", nullable = false)
    private Artwork artwork;

    @Column(nullable = false)
    private Integer rating;

    @Column(nullable = false, length = 1000)
    private String comment;

    @Column(nullable = false)
    @Builder.Default // Otherwise builder sets it to null
    private LocalDateTime createdAt = LocalDateTime.now();
}