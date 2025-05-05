package com.abiodun.expaq.service;

import com.abiodun.expaq.model.User;
import com.abiodun.expaq.model.User.UserRole;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Jwts;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;


@Service
public class JwtService {


    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", user.getAuthorities().stream()
                .map(authority -> User.UserRole.valueOf(authority.getAuthority())) // Convert authority to User.UserRole
                .map(UserRole::name) // Get the name of the User.UserRole
                .collect(Collectors.toList()));
        return Jwts
                .builder()
                .claims(claims)
                .subject(user.getUsername())
                .issuer("DCB")
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 60 * 10 * 1000))
                .signWith(generateKey())
                .compact();
    }

    public SecretKey generateKey(){
        byte[] decode = Decoders.BASE64.decode(getSecretKey());
        return Keys.hmacShaKeyFor(decode);
    }
    public String getSecretKey(){
        return "36763979244226452948404D635166546A576D5A7134743777217A25432A462D";
    }

    public String extractUserName(String authToken) {
        return extractClaims(authToken, Claims::getSubject);
    }

    private <T> T extractClaims(String authToken, Function <Claims,T> claimResolver) {
        Claims claims = extractClaims(authToken);
        return claimResolver.apply(claims);
    }

    private Claims extractClaims(String authToken) {
        return Jwts
                .parser()
                .verifyWith(generateKey())
                .build()
                .parseSignedClaims(authToken)
                .getPayload();

    }


    public boolean isTokenValid(String authToken, UserDetails userDetails) {
        final String username = extractUserName(authToken);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(authToken));
    }

    private boolean isTokenExpired(String authToken) {
        return extractExpiration(authToken).before(new Date());
    }

    private Date extractExpiration(String authToken) {
        return extractClaims(authToken, Claims::getExpiration);
    }
}
