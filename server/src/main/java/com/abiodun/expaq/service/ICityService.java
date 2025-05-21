package com.abiodun.expaq.service;

import com.abiodun.expaq.dto.CityDTO;
import java.util.List;
import java.util.UUID;

public interface ICityService {
    List<CityDTO> getAllCities();
    CityDTO getCityById(UUID id);
    CityDTO createCity(CityDTO cityDTO);
    CityDTO updateCity(UUID id, CityDTO cityDTO);
    void deleteCity(UUID id);
}
