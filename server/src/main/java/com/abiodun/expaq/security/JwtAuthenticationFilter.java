package com.abiodun.expaq.security;

import com.abiodun.expaq.repository.UserRepository;
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
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final ExpaqUserDetailsService userDetailsService;
    private final UserRepository userRepository;

    // Public endpoints for specific HTTP methods
    private static final String[] PUBLIC_GET_ENDPOINTS = {
            "/api/activities/**",
            "/",
            "/api/cities/**",
            "/api/countries/**",
            "/api/activity-types/**",
            "/api/auth/users-by-role",
            "/api/auth/users-by-role/**",
            "/api/activities/search",
            "/api/activities/search/**",
            "/api/activities/featured",
            "/api/activities/featured/**",
            "/api/activities/recommended",
            "/api/activities/recommended/**",
            "/api/payments/verify",
            "/api/payments/verify/**",
    };

    private static final String[] PUBLIC_POST_ENDPOINTS = {
            "/api/anonymous/comment"
    };

    private final AntPathMatcher pathMatcher = new AntPathMatcher(); // Instantiate AntPathMatcher

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        String requestURI = request.getRequestURI();
        String httpMethod = request.getMethod();

        // Check if the request matches any of the public GET endpoints
        if ("GET".equalsIgnoreCase(httpMethod) && isPublicEndpoint(requestURI, PUBLIC_GET_ENDPOINTS)) {
            log.info("Skipping authentication for public GET endpoint: {}", requestURI);
            filterChain.doFilter(request, response);
            return;
        }

        // Check if the request matches any of the public POST endpoints
        if ("POST".equalsIgnoreCase(httpMethod) && isPublicEndpoint(requestURI, PUBLIC_POST_ENDPOINTS)) {
            log.info("Skipping authentication for public POST endpoint: {}", requestURI);
            filterChain.doFilter(request, response);
            return;
        }

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

    private boolean isPublicEndpoint(String requestURI, String[] publicEndpoints) {
        for (String endpoint : publicEndpoints) {
            if (pathMatcher.match(endpoint, requestURI)) {
                return true;
            }
        }
        return false;
    }
}