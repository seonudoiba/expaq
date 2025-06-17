package com.abiodun.expaq.dto;

import lombok.Data;

@Data
public class RatingRequest {
    private String title;
    private String content;
    private int stars;
}
