package com.abiodun.expaq.service;

import com.abiodun.expaq.dto.CityDTO;
import com.abiodun.expaq.dto.response.CityResponse;

import java.util.List;
import java.util.UUID;

public interface ICityService {
    List<CityResponse> getAllCities();
    CityResponse getCityById(UUID id);
    CityResponse createCity(CityDTO cityDTO);
    CityResponse updateCity(UUID id, CityDTO cityDTO);
    void deleteCity(UUID id);
    
    // Additional methods for getting cities by country with counts
    List<CityResponse> getCitiesByCountryId(UUID countryId);
}
