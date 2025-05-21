package com.abiodun.expaq.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class CityDTO {
    private UUID id;
    private String name;
    private String image;
    private UUID countryId;

    public static CityDTO fromCity(com.abiodun.expaq.model.City city) {
        if (city == null) return null;
        CityDTO dto = new CityDTO();
        dto.setId(city.getId());
        dto.setName(city.getName());
        dto.setImage(city.getImage());
        dto.setCountryId(city.getCountry() != null ? city.getCountry().getId() : null);
        return dto;
    }
}