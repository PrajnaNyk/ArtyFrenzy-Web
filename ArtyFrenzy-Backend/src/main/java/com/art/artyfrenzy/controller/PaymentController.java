package com.art.artyfrenzy.controller;

import com.art.artyfrenzy.dto.PaymentRequest;
import com.art.artyfrenzy.dto.PaymentVerifyRequest;
import com.art.artyfrenzy.model.Order;
import com.art.artyfrenzy.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

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

}