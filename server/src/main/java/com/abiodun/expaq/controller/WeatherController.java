package com.abiodun.expaq.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/weather")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Weather", description = "Weather information for activities")
public class WeatherController {

    private final RestTemplate restTemplate;
    
    // You would typically inject this from application.properties
    private final String WEATHER_API_KEY = System.getenv("OPENWEATHER_API_KEY");
    private final String WEATHER_API_URL = "https://api.openweathermap.org/data/2.5";

    @GetMapping("/current")
    @Operation(summary = "Get current weather for a location")
    public ResponseEntity<Map<String, Object>> getCurrentWeather(
            @RequestParam String city,
            @RequestParam(required = false) String country,
            @RequestParam(required = false, defaultValue = "metric") String units) {
        
        try {
            String location = country != null ? city + "," + country : city;
            String url = String.format("%s/weather?q=%s&appid=%s&units=%s",
                    WEATHER_API_URL, location, WEATHER_API_KEY, units);
            
            log.info("Fetching current weather for location: {}", location);
            
            if (WEATHER_API_KEY == null || WEATHER_API_KEY.isEmpty()) {
                // Return mock data if no API key is configured
                return ResponseEntity.ok(getMockWeatherData(city, "current"));
            }
            
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error fetching current weather: {}", e.getMessage());
            // Return fallback mock data
            return ResponseEntity.ok(getMockWeatherData(city, "current"));
        }
    }

    @GetMapping("/forecast")
    @Operation(summary = "Get 5-day weather forecast for a location")
    public ResponseEntity<Map<String, Object>> getWeatherForecast(
            @RequestParam String city,
            @RequestParam(required = false) String country,
            @RequestParam(required = false, defaultValue = "metric") String units) {
        
        try {
            String location = country != null ? city + "," + country : city;
            String url = String.format("%s/forecast?q=%s&appid=%s&units=%s",
                    WEATHER_API_URL, location, WEATHER_API_KEY, units);
            
            log.info("Fetching weather forecast for location: {}", location);
            
            if (WEATHER_API_KEY == null || WEATHER_API_KEY.isEmpty()) {
                // Return mock data if no API key is configured
                return ResponseEntity.ok(getMockWeatherData(city, "forecast"));
            }
            
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error fetching weather forecast: {}", e.getMessage());
            // Return fallback mock data
            return ResponseEntity.ok(getMockWeatherData(city, "forecast"));
        }
    }

    @GetMapping("/activity-recommendation")
    @Operation(summary = "Get weather-based activity recommendations")
    public ResponseEntity<Map<String, Object>> getActivityWeatherRecommendation(
            @RequestParam String city,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String activityType) {
        
        try {
            // Get current weather
            Map<String, Object> currentWeather = getCurrentWeather(city, country, "metric").getBody();
            
            Map<String, Object> recommendation = new HashMap<>();
            recommendation.put("location", city);
            recommendation.put("weather", currentWeather);
            recommendation.put("recommendations", generateActivityRecommendations(currentWeather, activityType));
            recommendation.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            return ResponseEntity.ok(recommendation);
            
        } catch (Exception e) {
            log.error("Error generating weather-based recommendations: {}", e.getMessage());
            return ResponseEntity.ok(getMockRecommendations(city, activityType));
        }
    }

    private Map<String, Object> generateActivityRecommendations(Map<String, Object> weather, String activityType) {
        Map<String, Object> recommendations = new HashMap<>();
        
        if (weather == null || !weather.containsKey("main")) {
            recommendations.put("status", "unavailable");
            recommendations.put("message", "Weather data not available");
            return recommendations;
        }
        
        Map<String, Object> main = (Map<String, Object>) weather.get("main");
        double temperature = ((Number) main.get("temp")).doubleValue();
        double humidity = ((Number) main.get("humidity")).doubleValue();
        
        // Generate recommendations based on weather conditions
        String suitability;
        String recommendation;
        
        if (temperature >= 20 && temperature <= 30 && humidity < 70) {
            suitability = "excellent";
            recommendation = "Perfect weather for outdoor activities!";
        } else if (temperature >= 15 && temperature <= 35) {
            suitability = "good";
            recommendation = "Good weather for most activities.";
        } else if (temperature < 10) {
            suitability = "fair";
            recommendation = "Cool weather - indoor activities or warm outdoor activities recommended.";
        } else {
            suitability = "fair";
            recommendation = "Hot weather - indoor activities or water-based activities recommended.";
        }
        
        recommendations.put("suitability", suitability);
        recommendations.put("recommendation", recommendation);
        recommendations.put("temperature", temperature);
        recommendations.put("humidity", humidity);
        
        return recommendations;
    }

    private Map<String, Object> getMockWeatherData(String city, String type) {
        Map<String, Object> mockData = new HashMap<>();
        
        if ("current".equals(type)) {
            mockData.put("coord", Map.of("lon", -0.1276, "lat", 51.5074));
            mockData.put("weather", java.util.Arrays.asList(
                Map.of("id", 801, "main", "Clouds", "description", "few clouds", "icon", "02d")
            ));
            mockData.put("main", Map.of(
                "temp", 22.5,
                "feels_like", 23.1,
                "temp_min", 20.0,
                "temp_max", 25.0,
                "pressure", 1013,
                "humidity", 65
            ));
            mockData.put("wind", Map.of("speed", 3.5, "deg", 180));
            mockData.put("name", city);
            mockData.put("_note", "Mock data - Configure OPENWEATHER_API_KEY for real data");
        } else if ("forecast".equals(type)) {
            mockData.put("city", Map.of("name", city));
            mockData.put("list", java.util.Arrays.asList(
                Map.of(
                    "dt_txt", "2024-06-29 12:00:00",
                    "main", Map.of("temp", 23.0, "humidity", 60),
                    "weather", java.util.Arrays.asList(
                        Map.of("main", "Clear", "description", "clear sky")
                    )
                ),
                Map.of(
                    "dt_txt", "2024-06-30 12:00:00",
                    "main", Map.of("temp", 25.0, "humidity", 55),
                    "weather", java.util.Arrays.asList(
                        Map.of("main", "Clouds", "description", "partly cloudy")
                    )
                )
            ));
            mockData.put("_note", "Mock data - Configure OPENWEATHER_API_KEY for real data");
        }
        
        return mockData;
    }

    private Map<String, Object> getMockRecommendations(String city, String activityType) {
        Map<String, Object> mockRec = new HashMap<>();
        mockRec.put("location", city);
        mockRec.put("suitability", "good");
        mockRec.put("recommendation", "Good weather for outdoor activities");
        mockRec.put("temperature", 22.5);
        mockRec.put("humidity", 65);
        mockRec.put("_note", "Mock recommendations - Configure OPENWEATHER_API_KEY for real data");
        return mockRec;
    }
}