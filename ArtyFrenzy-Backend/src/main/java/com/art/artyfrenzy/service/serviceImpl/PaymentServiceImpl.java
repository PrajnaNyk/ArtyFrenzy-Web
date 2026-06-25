package com.art.artyfrenzy.service.serviceImpl;

import com.art.artyfrenzy.dto.PaymentRequest;
import com.art.artyfrenzy.dto.PaymentVerifyRequest;
import com.art.artyfrenzy.model.Artwork;
import com.art.artyfrenzy.model.Order;
import com.art.artyfrenzy.model.OrderItem;
import com.art.artyfrenzy.model.User;
import com.art.artyfrenzy.repository.ArtworkRepository;
import com.art.artyfrenzy.repository.OrderRepository;
import com.art.artyfrenzy.repository.UserRepository;
import com.art.artyfrenzy.service.PaymentService;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // ✅ ADDED

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ArtworkRepository artworkRepository;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Override
    public Map<String, Object> createOrder(PaymentRequest request) {
        try {
            if (request.getUserId() == null || request.getArtworkIds() == null || request.getTotalAmount() == null) {
                throw new RuntimeException("Missing required payment fields.");
            }

            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", Math.round(request.getTotalAmount() * 100));
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "order_" + System.currentTimeMillis());

            com.razorpay.Order razorpayOrder = razorpay.orders.create(orderRequest);

            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Order order = Order.builder()
                    .user(user)
                    .totalAmount(request.getTotalAmount())
                    .razorpayOrderId(razorpayOrder.get("id"))
                    .status(Order.OrderStatus.PENDING)
                    .build();

            List<OrderItem> items = new ArrayList<>();
            for (Long artworkId : request.getArtworkIds()) {
                Artwork artwork = artworkRepository.findById(artworkId)
                        .orElseThrow(() -> new RuntimeException("Artwork not found: " + artworkId));
                items.add(OrderItem.builder()
                        .order(order)
                        .artwork(artwork)
                        .price(artwork.getPrice())
                        .build());
            }
            order.setItems(items);
            orderRepository.save(order);

            Map<String, Object> response = new HashMap<>();
            response.put("razorpayOrderId", razorpayOrder.get("id"));
            response.put("amount", request.getTotalAmount());
            response.put("currency", "INR");
            response.put("keyId", razorpayKeyId);
            return response;

        } catch (RazorpayException e) {
            throw new RuntimeException("Razorpay Error: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Order creation failed: " + e.getMessage());
        }
    }

    @Override
    @Transactional // ✅ ADDED: Ensures Order update and Artwork update happen together
    public Order verifyPayment(PaymentVerifyRequest request) throws Exception {
        // 1. Verify HMAC SHA256 signature
        String payload = request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId();
        String generatedSignature = hmacSHA256(payload, razorpayKeySecret);

        if (!generatedSignature.equals(request.getRazorpaySignature())) {
            throw new RuntimeException("Payment verification failed! Invalid signature.");
        }

        // 2. Fetch order (Must fetch items and artworks to avoid LazyLoading errors)
        Order order = orderRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // 3. Update order status to PAID
        order.setRazorpayPaymentId(request.getRazorpayPaymentId());
        order.setRazorpaySignature(request.getRazorpaySignature());
        order.setStatus(Order.OrderStatus.PAID);

        // ✅ 4. NEW: Mark all artworks in this order as "Sold"
        List<OrderItem> items = order.getItems();
        if (items != null) {
            for (OrderItem item : items) {
                Artwork artwork = item.getArtwork();
                if (artwork != null) {
                    artwork.setStatus("Sold"); // Change from "Available" to "Sold"
                    artworkRepository.save(artwork);
                }
            }
        }

        // 5. Save the updated order
        return orderRepository.save(order);
    }

    @Override
    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    private String hmacSHA256(String data, String secret) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
        mac.init(secretKeySpec);
        byte[] hash = mac.doFinal(data.getBytes());
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }
}