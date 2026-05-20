package com.art.artyfrenzy.repository;

import com.art.artyfrenzy.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);

    long countByStatus(Order.OrderStatus status); 
    Long countByStatusNot(Order.OrderStatus status); // Count pending/failed
    
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status = 'PAID'")
    Double calculateTotalRevenue(); // Sums up all paid order amounts
}