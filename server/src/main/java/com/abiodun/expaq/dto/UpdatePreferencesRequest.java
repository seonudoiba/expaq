package com.abiodun.expaq.dto;

import lombok.Data;

@Data
public class UpdatePreferencesRequest {
    private String preferredLanguage;
    private String preferredCurrency;
    private String timeZone;
} 