package com.abiodun.expaq.service.impl;

import com.abiodun.expaq.dto.CountryDTO;
import com.abiodun.expaq.dto.response.CountryResponse;
import com.abiodun.expaq.exception.ResourceNotFoundException;
import com.abiodun.expaq.model.Country;
import com.abiodun.expaq.repository.CountryRepository;
import com.abiodun.expaq.service.ICountryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CountryServiceImpl implements ICountryService {
    private final CountryRepository countryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CountryResponse> getAllCountries() {
        log.debug("Fetching all countries with city and activity counts");
        return countryRepository.findAllWithCityAndActivityCount().stream()
                .map(row -> {
                    Country country = (Country) row[0];
                    Long cityCount = (Long) row[1];
                    Long activityCount = (Long) row[2];
                    return CountryResponse.fromCountryWithCounts(country, cityCount, activityCount);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CountryResponse getCountryById(UUID id) {
        log.debug("Fetching country with id: {}", id);
        
        List<Object[]> result = countryRepository.findByIdWithCityAndActivityCount(id);
        if (result.isEmpty()) {
            log.error("Country not found with id: {}", id);
            throw new ResourceNotFoundException("Country not found with id: " + id);
        }
        
        Object[] row = result.get(0);
        Country country = (Country) row[0];
        Long cityCount = (Long) row[1];
        Long activityCount = (Long) row[2];
        
        return CountryResponse.fromCountryWithCounts(country, cityCount, activityCount);
    }
    
    @Override
    @Transactional
    public CountryResponse createCountry(CountryDTO countryDTO) {
        log.debug("Creating new country: {}", countryDTO.getName());
        
        Country country = new Country();
        country.setName(countryDTO.getName());
        country.setImage(countryDTO.getImage());
        
        Country savedCountry = countryRepository.save(country);
        log.info("Created country with id: {}", savedCountry.getId());
        
        // Return the newly created country with counts (which will be 0 for new country)
        return CountryResponse.fromCountryWithCounts(savedCountry, 0L, 0L);
    }
    
    @Override
    @Transactional
    public CountryResponse updateCountry(UUID id, CountryDTO countryDTO) {
        log.debug("Updating country with id: {}", id);
        
        return countryRepository.findById(id)
                .map(existing -> {
                    existing.setName(countryDTO.getName());
                    existing.setImage(countryDTO.getImage());
                    
                    Country updatedCountry = countryRepository.save(existing);
                    log.info("Updated country with id: {}", id);
                    
                    // Get the updated country with counts
                    return getCountryById(id);
                })
                .orElseThrow(() -> {
                    log.error("Cannot update. Country not found with id: {}", id);
                    return new ResourceNotFoundException("Country not found with id: " + id);
                });
    }
    
    @Override
    @Transactional
    public void deleteCountry(UUID id) {
        log.debug("Deleting country with id: {}", id);
        
        if (!countryRepository.existsById(id)) {
            log.error("Cannot delete. Country not found with id: {}", id);
            throw new ResourceNotFoundException("Country not found with id: " + id);
        }
        
        countryRepository.deleteById(id);
        log.info("Deleted country with id: {}", id);
    }

//    @Override
//    public List<CountryDTO> getAllCountries() {
//        return countryRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
//    }
//
//    @Override
//    public CountryDTO getCountryById(UUID id) {
//        return countryRepository.findById(id).map(this::toDTO).orElse(null);
//    }
//
//    @Override
//    public CountryDTO createCountry(CountryDTO countryDTO) {
//        Country country = new Country();
//        country.setName(countryDTO.getName());
//        country.setImage(countryDTO.getImage());
////        Country country = toEntity(countryDTO);
//        return toDTO(countryRepository.save(country));
//    }
//
//    @Override
//    public CountryDTO updateCountry(UUID id, CountryDTO countryDTO) {
//        Country country = toEntity(countryDTO);
//        country.setId(id);
//        return toDTO(countryRepository.save(country));
//    }
//
//    @Override
//    public void deleteCountry(UUID id) {
//        countryRepository.deleteById(id);
//    }
}
