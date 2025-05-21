package com.abiodun.expaq.service;

import com.abiodun.expaq.dto.CountryDTO;
import java.util.List;
import java.util.UUID;

public interface ICountryService {
    List<CountryDTO> getAllCountries();
    CountryDTO getCountryById(UUID id);
    CountryDTO createCountry(CountryDTO countryDTO);
    CountryDTO updateCountry(UUID id, CountryDTO countryDTO);
    void deleteCountry(UUID id);
}
