package com.abiodun.expaq.security;

import com.abiodun.expaq.model.User;
import com.abiodun.expaq.repository.UserRepository;
import com.abiodun.expaq.service.ExpaqUserDetailsService;
import com.abiodun.expaq.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final ExpaqUserDetailsService userDetailsService;


    // List of public endpoints that should bypass authentication
    private static final List<String> PUBLIC_ENDPOINTS = Arrays.asList(
            "/api/auth/**",
            "/api/public/**",
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/error",
            "/api/activities",
            "/api/activities/{id}",
            "/api/activities/*"
    );
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.info("No valid Authorization header found");
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        try {
            userEmail = jwtService.extractEmail(jwt);
            log.info("Extracted email from token: {}", userEmail);
            
            if (userEmail != null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                log.info("Loaded user details with authorities: {}", userDetails.getAuthorities());
                
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    log.info("Token is valid for user: {}", userEmail);
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    log.info("Authentication set in context for user: {} with authorities: {}", 
                        userEmail, userDetails.getAuthorities());
                } else {
                    log.warn("Token validation failed for user: {}", userEmail);
                    SecurityContextHolder.clearContext();
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("Invalid token");
                    return;
                }
            } else {
                log.warn("No email found in token");
                SecurityContextHolder.clearContext();
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Invalid token format");
                return;
            }
        } catch (Exception e) {
            log.error("Error processing JWT token: {}", e.getMessage(), e);
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Error processing token: " + e.getMessage());
            return;
        }
        filterChain.doFilter(request, response);
    }

    private boolean isPublicEndpoint(String requestURI) {
        return PUBLIC_ENDPOINTS.stream().anyMatch(requestURI::startsWith);
    }
}