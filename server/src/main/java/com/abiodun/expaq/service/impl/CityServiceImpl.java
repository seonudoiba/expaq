package com.abiodun.expaq.service.impl;

import com.abiodun.expaq.dto.CityDTO;
import com.abiodun.expaq.model.City;
import com.abiodun.expaq.model.Country;
import com.abiodun.expaq.repository.CityRepository;
import com.abiodun.expaq.repository.CountryRepository;
import com.abiodun.expaq.service.ICityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CityServiceImpl implements ICityService {
    @Autowired
    private CityRepository cityRepository;
    @Autowired
    private CountryRepository countryRepository;

    private CityDTO toDTO(City city) {
        CityDTO dto = new CityDTO();
        dto.setId(city.getId());
        dto.setName(city.getName());
        dto.setImage(city.getImage());
        dto.setCountryId(city.getCountry() != null ? city.getCountry().getId() : null);
        return dto;
    }

    private City toEntity(CityDTO dto) {
        City city = new City();
        city.setId(dto.getId());
        city.setName(dto.getName());
        city.setImage(dto.getImage());
        if (dto.getCountryId() != null) {
            Optional<Country> country = countryRepository.findById(dto.getCountryId());
            country.ifPresent(city::setCountry);
        }
        return city;
    }

    @Override
    public List<CityDTO> getAllCities() {
        return cityRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public CityDTO getCityById(UUID id) {
        return cityRepository.findById(id).map(this::toDTO).orElse(null);
    }

    @Override
    public CityDTO createCity(CityDTO cityDTO) {
        City city = toEntity(cityDTO);
        return toDTO(cityRepository.save(city));
    }

    @Override
    public CityDTO updateCity(UUID id, CityDTO cityDTO) {
        City city = toEntity(cityDTO);
        city.setId(id);
        return toDTO(cityRepository.save(city));
    }

    @Override
    public void deleteCity(UUID id) {
        cityRepository.deleteById(id);
    }
}
