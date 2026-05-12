package com.art.artyfrenzy.dto;

import lombok.Data;
import java.util.List;

@Data
public class PaymentRequest {
    private Long userId;
    private List<Long> artworkIds;
    private Double totalAmount;
}