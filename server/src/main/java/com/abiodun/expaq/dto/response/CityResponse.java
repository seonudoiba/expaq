package com.abiodun.expaq.dto.response;

import com.abiodun.expaq.model.City;
import lombok.Data;

import java.util.UUID;

@Data
public class CityResponse {
    private UUID id;
    private String name;
    private String image;
    private UUID countryId;
    private Long activityCount;

    public static CityResponse fromCity(City city) {
        if (city == null) return null;
        CityResponse response = new CityResponse();
        response.setId(city.getId());
        response.setName(city.getName());
        response.setImage(city.getImage());
        response.setCountryId(city.getCountry() != null ? city.getCountry().getId() : null);
        
        // Set activity count if activities are loaded
        if (city.getActivities() != null) {
            response.setActivityCount((long) city.getActivities().size());
        }
        
        return response;
    }
    
    public static CityResponse fromCityWithCount(City city, Long activityCount) {
        CityResponse response = fromCity(city);
        if (response != null) {
            response.setActivityCount(activityCount);
        }
        return response;
    }
}
