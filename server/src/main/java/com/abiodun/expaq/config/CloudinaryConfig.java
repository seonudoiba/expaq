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

    @Value("${cloudinary.cloud.name:}")
    private String cloudName;

    @Value("${cloudinary.api.key:}")
    private String apiKey;

    @Value("${cloudinary.api.secret:}")
    private String apiSecret;

    @Bean
    public Cloudinary cloudinary() {
        if (cloudName == null || cloudName.isEmpty() || 
            apiKey == null || apiKey.isEmpty() || 
            apiSecret == null || apiSecret.isEmpty()) {
            logger.warn("Cloudinary configuration is incomplete. Cloudinary features will be disabled.");
            return null;
        }

        logger.info("Initializing Cloudinary with cloud name: {}", cloudName);
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", cloudName);
        config.put("api_key", apiKey);
        config.put("api_secret", apiSecret);

        return new Cloudinary(config);
    }
}