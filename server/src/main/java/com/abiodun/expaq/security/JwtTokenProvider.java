//package com.abiodun.expaq.security;
//
//import com.abiodun.expaq.model.User;
//import com.abiodun.expaq.repository.TokenBlacklistRepository;
//import io.jsonwebtoken.*;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.stereotype.Component;
//
//import javax.crypto.SecretKey;
//import java.util.Date;
//import java.util.stream.Collectors;
//
//@Component
//public class JwtTokenProvider {
//
//    private final SecretKey key;
//    private final long jwtExpirationInMs;
//    private  final TokenBlacklistRepository tokenBlacklistRepository;
//
//    public JwtTokenProvider(
//            @Value("${app.jwt.secret}") String jwtSecret,
//            @Value("${app.jwt.expiration-in-ms}") long jwtExpirationInMs, TokenBlacklistRepository tokenBlacklistRepository) {
//        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
//        this.jwtExpirationInMs = jwtExpirationInMs;
//        this.tokenBlacklistRepository = tokenBlacklistRepository;
//    }
//
//    public boolean validateToken(String token) {
//        try {
//            // Check if token is blacklisted
//            if (tokenBlacklistRepository.existsByToken(token)) {
//                return false;
//            }
//
//            Jwts.parserBuilder()
//                    .setSigningKey(key)
//                    .build()
//                    .parseClaimsJws(token);
//            return true;
//        } catch (JwtException | IllegalArgumentException e) {
//            return false;
//        }
//    }
//
//    public String generateToken(User user) {
//        Date now = new Date();
//        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);
//
//        return Jwts.builder()
//                .setSubject(user.getId().toString())
//                .claim("email", user.getEmail())
//                .claim("roles", user.getRoles().stream()
//                        .map(role -> "ROLE_" + role.getName())
//                        .collect(Collectors.toList()))
//                .claim("username", user.getUsername())
//                .setIssuedAt(now)
//                .setExpiration(expiryDate)
//                .signWith(key)
//                .compact();
//    }
//    public Date getExpirationDateFromToken(String token) {
//        Claims claims = Jwts.parserBuilder()
////                .setSigningKey(getSigningKey())
//                .setSigningKey(key)
//                .build()
//                .parseClaimsJws(token)
//                .getBody();
//
//        return claims.getExpiration();
//    }
//
//
//    public String getUserIdFromToken(String token) {
//        // With JJWT 0.12.x, the correct way to parse tokens is:
//        return Jwts.parserBuilder()
//                .setSigningKey(key)
//                .build()
//                .parseClaimsJws(token)
//                .getBody()
//                .getSubject();
//    }
//}