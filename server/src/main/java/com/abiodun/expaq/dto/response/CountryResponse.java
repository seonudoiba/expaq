package com.abiodun.expaq.dto.response;

import com.abiodun.expaq.model.Country;
import lombok.Data;

import java.util.UUID;

@Data
public class CountryResponse {
    private UUID id;
    private String name;
    private String image;
    private Long cityCount;
    private Long activityCount;

    public static CountryResponse fromCountry(Country country) {
        if (country == null) return null;
        CountryResponse response = new CountryResponse();
        response.setId(country.getId());
        response.setName(country.getName());
        response.setImage(country.getImage());
        
        // Set counts if collections are loaded
        if (country.getCities() != null) {
            response.setCityCount((long) country.getCities().size());
            // Calculate total activities across all cities
            response.setActivityCount(country.getCities().stream()
                .filter(city -> city.getActivities() != null)
                .flatMap(city -> city.getActivities().stream())
                .count());
        }
        
        return response;
    }
    
    public static CountryResponse fromCountryWithCounts(Country country, Long cityCount, Long activityCount) {
        CountryResponse response = fromCountry(country);
        if (response != null) {
            response.setCityCount(cityCount);
            response.setActivityCount(activityCount);
        }
        return response;
    }
}
