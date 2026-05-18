package com.art.artyfrenzy.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;

    @Column(nullable = false)
    private Double totalAmount;

    @Column
    private String razorpayOrderId;

    @Column
    private String razorpayPaymentId;

    @Column
    private String razorpaySignature;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default 
    private OrderStatus status = OrderStatus.PENDING;

    @Column(nullable = false, updatable = false)
    @Builder.Default //Tells Lombok to respect this default value
    private LocalDateTime createdAt = LocalDateTime.now();

    //Extra safety net to ensure createdAt is NEVER null before saving
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public enum OrderStatus {
        PENDING, PAID, FAILED, CANCELLED
    }
}