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
    
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items i LEFT JOIN FETCH i.artwork WHERE o.razorpayOrderId = :razorpayOrderId")
    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);

    long countByStatus(Order.OrderStatus status); 
    
    // Count orders that have successfully been paid (even if shipped/delivered later)
    long countByStatusIn(List<Order.OrderStatus> statuses);
    
    // Revenue stays even if order moves to Shipped/Delivered
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status IN ('PAID', 'SHIPPED', 'DELIVERED')")
    Double calculateTotalRevenue();

    // Fetch all orders for Admin with User and Items
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items i LEFT JOIN FETCH i.artwork LEFT JOIN FETCH o.user ORDER BY o.createdAt DESC")
    List<Order> findAllOrdersForAdmin();
}