// // File: c:\Users\Starr\Desktop\projects\expaq\server\src\main\java\com\abiodun\expaq\config\AppConfig.java
// package com.abiodun.expaq.config;

// import com.cloudinary.Cloudinary;
// import org.modelmapper.ModelMapper;
// import org.modelmapper.convention.MatchingStrategies;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;

// import java.util.HashMap;
// import java.util.Map;

// @Configuration
// public class AppConfig {

//     // Cloudinary Bean (assuming configuration is in application.properties/yml)
//     @Bean
//     public Cloudinary cloudinary() {
//         Map<String, String> config = new HashMap<>();
//         // Configuration will be picked up from environment variables or properties file
//         // CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
//         return new Cloudinary(System.getenv("CLOUDINARY_URL")); // Example using env var
//         // Alternatively, inject properties:
//         // @Value("${cloudinary.cloud_name}") private String cloudName;
//         // @Value("${cloudinary.api_key}") private String apiKey;
//         // @Value("${cloudinary.api_secret}") private String apiSecret;
//         // config.put("cloud_name", cloudName);
//         // config.put("api_key", apiKey);
//         // config.put("api_secret", apiSecret);
//         // return new Cloudinary(config);
//     }

//     // ModelMapper Bean
//     @Bean
//     public ModelMapper modelMapper() {
//         ModelMapper modelMapper = new ModelMapper();
//         // Configure to skip null properties during mapping
//         modelMapper.getConfiguration()
//                 .setSkipNullEnabled(true)
//                 .setMatchingStrategy(MatchingStrategies.STRICT); // Optional: Use strict matching
//         return modelMapper;
//     }
// }