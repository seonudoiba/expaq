package com.abiodun.expaq.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LocationStatsDTO {
    private String name;
    private Long count;
    private String imageUrl; // Add this field
}