package com.abiodun.expaq.service;

import com.abiodun.expaq.model.User;
import com.abiodun.expaq.repository.TokenBlacklistRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);

    private final SecretKey key;
    private final long jwtExpirationInMs;
    private final TokenBlacklistRepository tokenBlacklistRepository;

    public JwtService(
            @Value("${app.jwt.secret}") String jwtSecret,
            @Value("${app.jwt.expiration-in-ms}") long jwtExpirationInMs,
            TokenBlacklistRepository tokenBlacklistRepository) {
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        this.jwtExpirationInMs = jwtExpirationInMs;
        this.tokenBlacklistRepository = tokenBlacklistRepository;
    }

    public String extractUsername(String token) {
        System.out.println("token: " + token + "...........................................................................................................................................................................");
        return extractClaim(token, Claims::getSubject);
    }

    public String extractEmail(String token) {
        return extractClaim(token, claims -> claims.get("email", String.class));
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }


//    public String generateToken(UserDetails userDetails) {
//        return generateToken(new HashMap<>(), userDetails);
//    }
//
//    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
//        Date now = new Date();
//        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);
//
//        return Jwts.builder()
//                .setClaims(extraClaims)
//                .setSubject(userDetails.getUsername())
//                .setIssuedAt(now)
//                .setExpiration(expiryDate)
//                .signWith(key, SignatureAlgorithm.HS256)
//                .compact();
//    }

    public String generateToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
                .setSubject(user.getId().toString())
                .claim("email", user.getEmail())
                .claim("roles", user.getRoles().stream()
                        .map(role -> "ROLE_" + role.getName())
                        .collect(Collectors.toList()))
                .claim("username", user.getUsername())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            final String email = extractEmail(token);
            final boolean isTokenExpired = isTokenExpired(token);
            final boolean isTokenBlacklisted = isTokenBlacklisted(token);
            
            boolean isValid = email.equals(userDetails.getUsername()) 
                && !isTokenExpired 
                && !isTokenBlacklisted;
                
            if (!isValid) {
                log.debug("Token validation failed - email match: {}, expired: {}, blacklisted: {}", 
                    email.equals(userDetails.getUsername()),
                    isTokenExpired,
                    isTokenBlacklisted);
            }
            
            return isValid;
        } catch (Exception e) {
            log.error("Error validating token: {}", e.getMessage());
            return false;
        }
    }

    public boolean validateToken(String token) {
        try {
            if (isTokenBlacklisted(token)) {
                log.debug("Token is blacklisted");
                return false;
            }

            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.error("Error validating token: {}", e.getMessage());
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private boolean isTokenBlacklisted(String token) {
        return tokenBlacklistRepository.existsByToken(token);
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

//    private Claims extractAllClaims(String token) {
//        return Jwts.parserBuilder()
//                .setSigningKey(key)
//                .build()
//                .parseClaimsJws(token)
//                .getBody();
//    }
    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException ex) {
            System.out.println("The token is expired" + ex.getMessage() + ex.getClaims());
            return ex.getClaims(); // Still usable for some metadata (e.g., user ID for refresh)
        }
    }


    public Date getExpirationDateFromToken(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public String getUserIdFromToken(String token) {
        return extractClaim(token, Claims::getSubject);
    }
}