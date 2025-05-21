package com.abiodun.expaq.controller;

import com.abiodun.expaq.dto.CountryDTO;
import com.abiodun.expaq.service.ICountryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/countries")
public class CountryController {
    @Autowired
    private ICountryService countryService;

    @GetMapping
    public List<CountryDTO> getAllCountries() {
        return countryService.getAllCountries();
    }

    @GetMapping("/{id}")
    public CountryDTO getCountryById(@PathVariable UUID id) {
        return countryService.getCountryById(id);
    }

    @PostMapping
    public CountryDTO createCountry(@RequestBody CountryDTO countryDTO) {
        return countryService.createCountry(countryDTO);
    }

    @PutMapping("/{id}")
    public CountryDTO updateCountry(@PathVariable UUID id, @RequestBody CountryDTO countryDTO) {
        return countryService.updateCountry(id, countryDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteCountry(@PathVariable UUID id) {
        countryService.deleteCountry(id);
    }
}
