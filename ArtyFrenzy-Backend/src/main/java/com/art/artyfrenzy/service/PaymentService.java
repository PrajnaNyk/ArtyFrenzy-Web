package com.art.artyfrenzy.service;

import com.art.artyfrenzy.dto.PaymentRequest;
import com.art.artyfrenzy.dto.PaymentVerifyRequest;
import com.art.artyfrenzy.model.Order;

import java.util.List;
import java.util.Map;

public interface PaymentService {
    Map<String, Object> createOrder(PaymentRequest request) throws Exception;
    Order verifyPayment(PaymentVerifyRequest request) throws Exception;
    List<Order> getUserOrders(Long userId);
}