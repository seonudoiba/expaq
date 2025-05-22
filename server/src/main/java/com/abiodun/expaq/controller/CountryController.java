package com.abiodun.expaq.controller;

import com.abiodun.expaq.dto.CountryDTO;
import com.abiodun.expaq.dto.response.CountryResponse;
import com.abiodun.expaq.service.ICountryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/countries")
@Tag(name = "Countries", description = "API for managing countries")
public class CountryController {
    private final ICountryService countryService;

    @GetMapping
    @Operation(summary = "Get all countries with city and activity counts")
    public ResponseEntity<List<CountryResponse>> getAllCountries() {
        log.debug("REST request to get all countries with city and activity counts");
        List<CountryResponse> countries = countryService.getAllCountries();
        return ResponseEntity.ok(countries);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get country by ID with city and activity counts")
    public ResponseEntity<CountryResponse> getCountryById(@PathVariable UUID id) {
        log.debug("REST request to get country by id: {}", id);
        return ResponseEntity.ok(countryService.getCountryById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new country")
    public ResponseEntity<CountryResponse> createCountry(@Valid @RequestBody CountryDTO countryDTO) {
        log.debug("REST request to create country: {}", countryDTO);
        CountryResponse createdCountry = countryService.createCountry(countryDTO);
        return new ResponseEntity<>(createdCountry, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing country")
    public ResponseEntity<CountryResponse> updateCountry(
            @PathVariable UUID id,
            @Valid @RequestBody CountryDTO countryDTO) {
        log.debug("REST request to update country with id {}: {}", id, countryDTO);
        CountryResponse updatedCountry = countryService.updateCountry(id, countryDTO);
        return ResponseEntity.ok(updatedCountry);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a country")
    public ResponseEntity<Void> deleteCountry(@PathVariable UUID id) {
        log.debug("REST request to delete country with id: {}", id);
        countryService.deleteCountry(id);
        return ResponseEntity.noContent().build();
    }
}
