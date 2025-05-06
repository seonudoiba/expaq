//package com.abiodun.expaq.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//import org.springframework.web.filter.CorsFilter;
//
//@Configuration
//public class CorsConfig {
//
//    @Bean
//    public CorsFilter corsFilter() {
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        CorsConfiguration config = new CorsConfiguration();
//
//        // Allow all origins for development - in production, specify your frontend URL
//        config.addAllowedOrigin("http://localhost:3000");
//
//        // Allow common HTTP methods
//        config.addAllowedMethod("GET");
//        config.addAllowedMethod("POST");
//        config.addAllowedMethod("PUT");
//        config.addAllowedMethod("DELETE");
//        config.addAllowedMethod("OPTIONS");
//
//        // Allow all headers
//        config.addAllowedHeader("*");
//
//        // Allow credentials (cookies, authorization headers, etc.)
//        config.setAllowCredentials(true);
//
//        // How long the response to the preflight request can be cached
//        config.setMaxAge(3600L);
//
//        source.registerCorsConfiguration("/api/**", config);
//        return new CorsFilter(source);
//    }
//}