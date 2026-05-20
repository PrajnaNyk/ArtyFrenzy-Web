package com.art.artyfrenzy.controller;

import com.art.artyfrenzy.dto.PaymentRequest;
import com.art.artyfrenzy.dto.PaymentVerifyRequest;
import com.art.artyfrenzy.model.Order;
import com.art.artyfrenzy.repository.OrderRepository;
import com.art.artyfrenzy.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final OrderRepository orderRepository;
    public PaymentController(PaymentService paymentService, OrderRepository orderRepository) {
        this.paymentService = paymentService;
        this.orderRepository = orderRepository;
    }

    // Create Razorpay order
    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody PaymentRequest request) throws Exception {
        return ResponseEntity.ok(paymentService.createOrder(request));
    }

    // Verify payment after success
    @PostMapping("/verify")
    public ResponseEntity<Order> verifyPayment(@RequestBody PaymentVerifyRequest request) throws Exception {
        return ResponseEntity.ok(paymentService.verifyPayment(request));
    }

    // Get user orders
    @GetMapping("/orders/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(paymentService.getUserOrders(userId));
    }

    // Get stats for Admin Dashboard
    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        long paidOrders = orderRepository.countByStatus(Order.OrderStatus.PAID);
        long pendingOrders = orderRepository.countByStatus(Order.OrderStatus.PENDING);
        long failedOrders = orderRepository.countByStatus(Order.OrderStatus.FAILED);
        double totalRevenue = orderRepository.calculateTotalRevenue();
        long totalOrders = paidOrders + pendingOrders + failedOrders;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalOrders", totalOrders);
        stats.put("paidOrders", paidOrders);
        stats.put("pendingOrders", pendingOrders);
        stats.put("failedOrders", failedOrders);
        stats.put("totalRevenue", totalRevenue);
        
        return ResponseEntity.ok(stats);
    }

}