package com.abiodun.expaq.service.impl;

import com.abiodun.expaq.dto.CountryDTO;
import com.abiodun.expaq.model.Country;
import com.abiodun.expaq.repository.CountryRepository;
import com.abiodun.expaq.service.ICountryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CountryServiceImpl implements ICountryService {
    @Autowired
    private CountryRepository countryRepository;

    private CountryDTO toDTO(Country country) {
        CountryDTO dto = new CountryDTO();
        dto.setId(country.getId());
        dto.setName(country.getName());
        dto.setImage(country.getImage());
        return dto;
    }

    private Country toEntity(CountryDTO dto) {
        Country country = new Country();
        country.setId(dto.getId());
        country.setName(dto.getName());
        country.setImage(dto.getImage());
        return country;
    }

    @Override
    public List<CountryDTO> getAllCountries() {
        return countryRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public CountryDTO getCountryById(UUID id) {
        return countryRepository.findById(id).map(this::toDTO).orElse(null);
    }

    @Override
    public CountryDTO createCountry(CountryDTO countryDTO) {
        Country country = new Country();
        country.setName(countryDTO.getName());
        country.setImage(countryDTO.getImage());
//        Country country = toEntity(countryDTO);
        return toDTO(countryRepository.save(country));
    }

    @Override
    public CountryDTO updateCountry(UUID id, CountryDTO countryDTO) {
        Country country = toEntity(countryDTO);
        country.setId(id);
        return toDTO(countryRepository.save(country));
    }

    @Override
    public void deleteCountry(UUID id) {
        countryRepository.deleteById(id);
    }
}
