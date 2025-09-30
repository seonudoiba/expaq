package com.abiodun.expaq.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.boot.jdbc.DataSourceBuilder;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

@Configuration
@Profile("prod")
public class HerokuDatabaseConfig {

    @Bean
    @ConditionalOnProperty(name = "DATABASE_URL")
    public DataSource dataSource() throws URISyntaxException {
        String databaseUrl = System.getenv("DATABASE_URL");
        String username = System.getenv("DATABASE_USERNAME");
        String password = System.getenv("DATABASE_PASSWORD");
        
        if (databaseUrl != null && !databaseUrl.isEmpty()) {
            // Check if URL is already in JDBC format
            if (databaseUrl.startsWith("jdbc:postgresql://")) {
                // Already in JDBC format, use as-is
                String dbUrl = databaseUrl;
                
                // Add SSL if needed for external databases
                if (!dbUrl.contains("?")) {
                    dbUrl += "?sslmode=require";
                } else if (!dbUrl.contains("sslmode")) {
                    dbUrl += "&sslmode=require";
                }
                
                return DataSourceBuilder.create()
                        .url(dbUrl)
                        .username(username)
                        .password(password)
                        .driverClassName("org.postgresql.Driver")
                        .build();
            } else {
                // Heroku format: postgres://username:password@host:port/database
                URI dbUri = new URI(databaseUrl);
                
                if (dbUri.getUserInfo() != null) {
                    String[] userInfo = dbUri.getUserInfo().split(":");
                    username = userInfo[0];
                    password = userInfo[1];
                }
                
                String dbUrl = "jdbc:postgresql://" + dbUri.getHost() + ':' + dbUri.getPort() + dbUri.getPath();
                
                // Add SSL if needed (Heroku requires SSL for Postgres)
                if (!dbUrl.contains("?")) {
                    dbUrl += "?sslmode=require";
                } else {
                    dbUrl += "&sslmode=require";
                }
                
                return DataSourceBuilder.create()
                        .url(dbUrl)
                        .username(username)
                        .password(password)
                        .driverClassName("org.postgresql.Driver")
                        .build();
            }
        }
        
        // Fallback to default configuration
        return DataSourceBuilder.create().build();
    }
}