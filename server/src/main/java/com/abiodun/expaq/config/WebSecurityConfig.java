//package com.abiodun.expaq.config;
//
//import com.abiodun.expaq.security.JwtAuthenticationFilter;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.AuthenticationProvider;
//import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
//import org.springframework.security.config.Customizer;
//import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
//import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
//import org.springframework.security.core.userdetails.User;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.provisioning.InMemoryUserDetailsManager;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//import org.springframework.web.filter.CorsFilter; // Add import for CorsFilter
//
// @Configuration
// @EnableWebSecurity
// @EnableMethodSecurity
//public class WebSecurityConfig {
//    private final UserDetailsService userDetailsService;
//    private final JwtAuthenticationFilter jwtAuthenticationFilter;
//    private final CorsFilter corsFilter; // Inject CorsFilter
//
//
//    public WebSecurityConfig(UserDetailsService userDetailsService, JwtAuthenticationFilter jwtAuthenticationFilter, CorsFilter corsFilter) { // Update constructor signature
//        this.userDetailsService = userDetailsService;
//        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
//        this.corsFilter = corsFilter; // Assign injected CorsFilter
//    }
//
//    // @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
//        httpSecurity
//                .csrf(AbstractHttpConfigurer::disable)
//                .authorizeHttpRequests(
//                        request -> request
//                                .requestMatchers("/register", "/login").permitAll()
//                                .anyRequest().authenticated()
//
//                )
//                .httpBasic(Customizer.withDefaults())
//                .addFilterBefore(corsFilter, UsernamePasswordAuthenticationFilter.class) // Add CorsFilter
//                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
//
//                return httpSecurity.build();
//    }
//    @Bean
//    public UserDetailsService userDetailsService() {
//        UserDetails user = User.withUsername("user").password("{noop}password").roles("USER").build();
//        UserDetails admin = User.withUsername("admin").password("{noop}password").roles("ADMIN", "USER").build();
//        return new InMemoryUserDetailsManager(user, admin);
//    }
//    // @Bean
//    public BCryptPasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder(14);
//    }
//
//    // @Bean
//    public AuthenticationProvider authenticationProvider() {
//        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
//        daoAuthenticationProvider.setUserDetailsService(userDetailsService);
//        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
//
//        return daoAuthenticationProvider;
//    }
//
//    // @Bean
//    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
//        return authenticationConfiguration.getAuthenticationManager();
//    }
//
//    // @Bean
//    public CorsFilter corsFilter() {
//        org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
//        org.springframework.web.cors.CorsConfiguration config = new org.springframework.web.cors.CorsConfiguration();
//        config.setAllowCredentials(true);
//        config.addAllowedOrigin("http://localhost:3000"); // Add your frontend URL
//        config.addAllowedHeader("*");
//        config.addAllowedMethod("*");
//        source.registerCorsConfiguration("/**", config);
//        return new CorsFilter(source);
//    }
//}
