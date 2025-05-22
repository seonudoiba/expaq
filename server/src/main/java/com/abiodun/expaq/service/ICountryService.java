package com.abiodun.expaq.service;

import com.abiodun.expaq.dto.CountryDTO;
import com.abiodun.expaq.dto.response.CountryResponse;

import java.util.List;
import java.util.UUID;

public interface ICountryService {
    List<CountryResponse> getAllCountries();
    CountryResponse getCountryById(UUID id);
    CountryResponse createCountry(CountryDTO countryDTO);
    CountryResponse updateCountry(UUID id, CountryDTO countryDTO);
    void deleteCountry(UUID id);
}
