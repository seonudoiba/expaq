package com.abiodun.expaq.service.thirdparty;

import org.locationtech.jts.geom.Coordinate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Objects;

@Service
public class GeocodingService {

    private static final String NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GeocodingService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public Coordinate getCoordinates(String address, String city, String country) {
        // Attempt geocoding with full address
        Coordinate coordinates = queryGeocodingService(address, city, country);
        if (coordinates != null) {
            return coordinates;
        }

        // If no results, attempt geocoding with city and country only
        coordinates = queryGeocodingService(null, city, country);
        if (coordinates != null) {
            return coordinates;
        }

        // If still no results, attempt geocoding with country only
        coordinates = queryGeocodingService(null, null, country);
        if (coordinates != null) {
            return coordinates;
        }

        // If all attempts fail, throw an exception
        throw new IllegalArgumentException("No results found for the given address, city, or country.");
    }

    private Coordinate queryGeocodingService(String address, String city, String country) {
        try {
            // Build the query string
            StringBuilder queryBuilder = new StringBuilder();
            if (address != null && !address.isEmpty()) {
                queryBuilder.append(address).append(", ");
            }
            if (city != null && !city.isEmpty()) {
                queryBuilder.append(city).append(", ");
            }
            if (country != null && !country.isEmpty()) {
                queryBuilder.append(country);
            }

            // Build the URI with query parameters
            String uri = UriComponentsBuilder.fromHttpUrl(NOMINATIM_URL)
                    .queryParam("q", queryBuilder.toString().trim())
                    .queryParam("format", "json")
                    .queryParam("addressdetails", "1")
                    .queryParam("limit", "1")
                    .toUriString();

            // Make the API call
            String response = Objects.requireNonNull(restTemplate
                    .getForObject(uri, String.class, "YourApplicationName/1.0 (your_email@example.com)"));

            // Parse the JSON response
            JsonNode rootNode = objectMapper.readTree(response);
            if (rootNode.isArray() && !rootNode.isEmpty()) {
                JsonNode firstResult = rootNode.get(0);
                double latitude = firstResult.get("lat").asDouble();
                double longitude = firstResult.get("lon").asDouble();
                return new Coordinate(longitude, latitude);
            }

            // No results found
            return null;

        } catch (Exception e) {
            // Log the error and return null
            System.err.println("Error querying geocoding service: " + e.getMessage());
            return null;
        }
    }
}