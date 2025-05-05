package com.abiodun.expaq.response;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingResponse {
    private UUID id;
    private String title;
    private String content;
    private int stars;

}
