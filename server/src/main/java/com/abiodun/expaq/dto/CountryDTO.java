package com.abiodun.expaq.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class CountryDTO {
    private UUID id;
    private String name;
    private String image;

    public static CountryDTO fromCountry(com.abiodun.expaq.model.Country country) {
        if (country == null) return null;
        CountryDTO dto = new CountryDTO();
        dto.setId(country.getId());
        dto.setName(country.getName());
        dto.setImage(country.getImage());
        return dto;
    }
}