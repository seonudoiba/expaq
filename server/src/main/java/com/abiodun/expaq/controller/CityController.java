package com.abiodun.expaq.controller;

import com.abiodun.expaq.dto.CityDTO;
import com.abiodun.expaq.service.ICityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cities")
public class CityController {
    @Autowired
    private ICityService cityService;

    @GetMapping
    public List<CityDTO> getAllCities() {
        return cityService.getAllCities();
    }

    @GetMapping("/{id}")
    public CityDTO getCityById(@PathVariable UUID id) {
        return cityService.getCityById(id);
    }

    @PostMapping
    public CityDTO createCity(@RequestBody CityDTO cityDTO) {
        return cityService.createCity(cityDTO);
    }

    @PutMapping("/{id}")
    public CityDTO updateCity(@PathVariable UUID id, @RequestBody CityDTO cityDTO) {
        return cityService.updateCity(id, cityDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteCity(@PathVariable UUID id) {
        cityService.deleteCity(id);
    }
}
