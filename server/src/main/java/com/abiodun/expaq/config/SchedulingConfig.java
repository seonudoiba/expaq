package com.abiodun.expaq.config;

import com.abiodun.expaq.repository.TokenBlacklistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.util.Date;

@Configuration
@EnableScheduling
public class SchedulingConfig {

    private final TokenBlacklistRepository tokenBlacklistRepository;

    @Autowired
    public SchedulingConfig(TokenBlacklistRepository tokenBlacklistRepository) {
        this.tokenBlacklistRepository = tokenBlacklistRepository;
    }
//0 0 * * * * - Every hour
//0 0 0 * * * - Every day at midnight
//0 0 0/12 * * * - Every 12 hours

    @Scheduled(cron = "0 0 * * * *") // Run every hour
    public void cleanupExpiredTokens() {
        tokenBlacklistRepository.deleteByExpirationDateBefore(new Date());
    }
}