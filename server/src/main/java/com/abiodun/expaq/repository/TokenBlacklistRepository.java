package com.abiodun.expaq.repository;

import com.abiodun.expaq.model.TokenBlacklist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.UUID;

public interface TokenBlacklistRepository extends JpaRepository<TokenBlacklist, UUID> {
    boolean existsByToken(String token);
    void deleteByExpirationDateBefore(Date date);
//
//    void deleteByUserId(UUID userId);
//
//    void invalidateAllUserTokens(UUID userId);
//
}