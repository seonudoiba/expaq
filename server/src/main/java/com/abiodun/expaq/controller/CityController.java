package com.abiodun.expaq.controller;

import com.abiodun.expaq.dto.CityDTO;
import com.abiodun.expaq.dto.response.CityResponse;
import com.abiodun.expaq.service.ICityService;
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
@RequestMapping("/api/cities")
@Tag(name = "Cities", description = "API for managing cities")
public class CityController {
    private final ICityService cityService;

    @GetMapping
    @Operation(summary = "Get all cities with activity counts")
    public ResponseEntity<List<CityResponse>> getAllCities() {
        log.debug("REST request to get all cities with activity counts");
        List<CityResponse> cities = cityService.getAllCities();
        return ResponseEntity.ok(cities);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get city by ID with activity count")
    public ResponseEntity<CityResponse> getCityById(@PathVariable UUID id) {
        log.debug("REST request to get city by id: {}", id);
        return ResponseEntity.ok(cityService.getCityById(id));
    }
    
    @GetMapping("/country/{countryId}")
    @Operation(summary = "Get all cities for a country with activity counts")
    public ResponseEntity<List<CityResponse>> getCitiesByCountryId(@PathVariable UUID countryId) {
        log.debug("REST request to get cities for country id: {}", countryId);
        return ResponseEntity.ok(cityService.getCitiesByCountryId(countryId));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new city")
    public ResponseEntity<CityResponse> createCity(@Valid @RequestBody CityDTO cityDTO) {
        log.debug("REST request to create city: {}", cityDTO);
        CityResponse createdCity = cityService.createCity(cityDTO);
        return new ResponseEntity<>(createdCity, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing city")
    public ResponseEntity<CityResponse> updateCity(
            @PathVariable UUID id,
            @Valid @RequestBody CityDTO cityDTO) {
        log.debug("REST request to update city with id {}: {}", id, cityDTO);
        CityResponse updatedCity = cityService.updateCity(id, cityDTO);
        return ResponseEntity.ok(updatedCity);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a city")
    public ResponseEntity<Void> deleteCity(@PathVariable UUID id) {
        log.debug("REST request to delete city with id: {}", id);
        cityService.deleteCity(id);
        return ResponseEntity.noContent().build();
    }
}
