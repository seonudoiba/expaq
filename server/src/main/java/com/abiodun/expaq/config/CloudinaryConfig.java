package com.abiodun.expaq.config;

import com.cloudinary.Cloudinary;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    private static final Logger logger = LoggerFactory.getLogger(CloudinaryConfig.class);

    @Value("${cloudinary.api.key}")
    private String API_KEY;

    @Value("${cloudinary.api.secret}")
    private String API_SECRET;

    @Value("${cloudinary.cloud.name}")
    private String CLOUD_NAME;

    @Bean
    public Cloudinary cloudinary() {
        logger.info("Cloudinary Configuration: cloud_name={}, api_key={}, api_secret={} (masked)", CLOUD_NAME, API_KEY, "***");

        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", CLOUD_NAME);
        config.put("api_key", API_KEY);
        config.put("api_secret", API_SECRET);

        return new Cloudinary(config);
    }
}