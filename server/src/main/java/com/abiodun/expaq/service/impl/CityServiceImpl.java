package com.abiodun.expaq.service.impl;

import com.abiodun.expaq.dto.CityDTO;
import com.abiodun.expaq.dto.response.CityResponse;
import com.abiodun.expaq.exception.ResourceNotFoundException;
import com.abiodun.expaq.model.City;
import com.abiodun.expaq.model.Country;
import com.abiodun.expaq.repository.CityRepository;
import com.abiodun.expaq.repository.CountryRepository;
import com.abiodun.expaq.service.ICityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CityServiceImpl implements ICityService {
    private final CityRepository cityRepository;
    private final CountryRepository countryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CityResponse> getAllCities() {
        log.debug("Fetching all cities with activity counts");
        return cityRepository.findAllWithActivityCount().stream()
                .map(row -> {
                    City city = (City) row[0];
                    Long activityCount = (Long) row[1];
                    return CityResponse.fromCityWithCount(city, activityCount);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CityResponse getCityById(UUID id) {
        log.debug("Fetching city with id: {}", id);
        
        List<Object[]> result = cityRepository.findByIdWithActivityCount(id);
        if (result.isEmpty()) {
            log.error("City not found with id: {}", id);
            throw new ResourceNotFoundException("City not found with id: " + id);
        }
        
        Object[] row = result.get(0);
        City city = (City) row[0];
        Long activityCount = (Long) row[1];
        
        return CityResponse.fromCityWithCount(city, activityCount);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CityResponse> getCitiesByCountryId(UUID countryId) {
        log.debug("Fetching cities for country id: {}", countryId);
        return cityRepository.findByCountryIdWithActivityCount(countryId).stream()
                .map(row -> {
                    City city = (City) row[0];
                    Long activityCount = (Long) row[1];
                    return CityResponse.fromCityWithCount(city, activityCount);
                })
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public CityResponse createCity(CityDTO cityDTO) {
        log.debug("Creating new city: {}", cityDTO.getName());
        
        City city = new City();
        city.setName(cityDTO.getName());
        city.setImage(cityDTO.getImage());
        
        // Set country if countryId is provided
        if (cityDTO.getCountryId() != null) {
            Country country = countryRepository.findById(cityDTO.getCountryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Country not found with id: " + cityDTO.getCountryId()));
            city.setCountry(country);
        }
        
        City savedCity = cityRepository.save(city);
        log.info("Created city with id: {}", savedCity.getId());
        
        // Return the newly created city with count (which will be 0 for new city)
        return CityResponse.fromCityWithCount(savedCity, 0L);
    }
    
    @Override
    @Transactional
    public CityResponse updateCity(UUID id, CityDTO cityDTO) {
        log.debug("Updating city with id: {}", id);
        
        return cityRepository.findById(id)
                .map(existing -> {
                    existing.setName(cityDTO.getName());
                    existing.setImage(cityDTO.getImage());
                    
                    // Update country if countryId is provided and different
                    if (cityDTO.getCountryId() != null && 
                        (existing.getCountry() == null || !existing.getCountry().getId().equals(cityDTO.getCountryId()))) {
                        Country country = countryRepository.findById(cityDTO.getCountryId())
                                .orElseThrow(() -> new ResourceNotFoundException("Country not found with id: " + cityDTO.getCountryId()));
                        existing.setCountry(country);
                    }
                    
                    City updatedCity = cityRepository.save(existing);
                    log.info("Updated city with id: {}", id);
                    
                    // Get the updated city with count
                    return getCityById(id);
                })
                .orElseThrow(() -> {
                    log.error("Cannot update. City not found with id: {}", id);
                    return new ResourceNotFoundException("City not found with id: " + id);
                });
    }
    
    @Override
    @Transactional
    public void deleteCity(UUID id) {
        log.debug("Deleting city with id: {}", id);
        
        if (!cityRepository.existsById(id)) {
            log.error("Cannot delete. City not found with id: {}", id);
            throw new ResourceNotFoundException("City not found with id: " + id);
        }
        
        cityRepository.deleteById(id);
        log.info("Deleted city with id: {}", id);
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

//    @Override
//    public List<CityDTO> getAllCities() {
//        return cityRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
//    }
//
//    @Override
//    public CityDTO getCityById(UUID id) {
//        return cityRepository.findById(id).map(this::toDTO).orElse(null);
//    }
//
//    @Override
//    public CityDTO createCity(CityDTO cityDTO) {
//        City city = toEntity(cityDTO);
//        return toDTO(cityRepository.save(city));
//    }
//
//    @Override
//    public CityDTO updateCity(UUID id, CityDTO cityDTO) {
//        City city = toEntity(cityDTO);
//        city.setId(id);
//        return toDTO(cityRepository.save(city));
//    }
//
//    @Override
//    public void deleteCity(UUID id) {
//        cityRepository.deleteById(id);
//    }
}

