package com.abiodun.expaq.repository;

import com.abiodun.expaq.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    Optional<User> findByUsername(String username);
    
    // OAuth2 related queries
    Optional<User> findByProviderAndProviderId(String provider, String providerId);
    
    // Verification related queries
    Optional<User> findByVerificationToken(String token);
    List<User> findByIsVerifiedFalseAndVerificationTokenExpiryBefore(LocalDateTime expiry);
    
    // Password reset related queries
    Optional<User> findByResetPasswordToken(String token);
    List<User> findByResetPasswordTokenExpiryBefore(LocalDateTime expiry);
    
    // Role based queries
    List<User> findByRole(com.abiodun.expaq.model.User.UserRole role);
    
    // Search queries
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<User> searchUsers(@Param("query") String query, Pageable pageable);
    
    // Host specific queries
    @Query("SELECT u FROM User u WHERE u.role = 'HOST' AND u.id IN " +
           "(SELECT a.host.id FROM Activity a WHERE a.isActive = true)")
    List<User> findActiveHosts();

    List<User> findByRoleAndIsVerified(User.UserRole role, boolean isVerified);

}
