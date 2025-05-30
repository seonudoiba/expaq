package com.abiodun.expaq.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.*;

@Data
@Entity
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = true)
    private LocalDateTime lastLoginAt;


    @Column(nullable = false)
    private String password;

    @Column(nullable = true)
    private LocalDateTime passwordUpdatedAt;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column
    private String profilePicture;

    @Column(nullable = false, unique = true)
    private String username;

    @Column
    private String phoneNumber;

    @Column
    private String bio;

//    @Enumerated(EnumType.STRING)
//    @Column(nullable = false)
//    private Role role;

    @Column(nullable = false)
    private boolean isVerified = false;

    @Column
    private String verificationToken;

    @Column
    private LocalDateTime verificationTokenExpiry;

    @Column
    private String resetPasswordToken;

    @Column
    private LocalDateTime resetPasswordTokenExpiry;

    @Column(nullable = false)
    private boolean isActive = true;

    @Column
    private String preferredLanguage;

    @Column
    private String preferredCurrency;

    @Column
    private String timeZone;

    @JsonIgnore
    @OneToMany(mappedBy = "host", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Activity> hostedActivities = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Booking> bookings = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Message> sentMessages = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Message> receivedMessages = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Notification> notifications = new ArrayList<>();

    @Override
    public String getPassword() {
        return this.password;
    }
    private String oAuth2Provider;
    private String oAuth2ProviderId;

    public void setOAuth2Provider(String provider) {
        this.oAuth2Provider = provider;
    }

    public void setOAuth2ProviderId(String providerId) {
        this.oAuth2ProviderId = providerId;
    }

    public void setEmailVerified(boolean isVerified) {
        this.isVerified = isVerified;
    }

    @ManyToMany
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @Enumerated(EnumType.STRING)
    private Set<Role> roles = new HashSet<>();

//    public Collection<Role> getRoles() {
//        Set<Role> userRoles = new HashSet<>();
//        for (Role role : roles) {
//            userRoles.add(Role.valueOf(role.getName())); // Assuming Role has a getName() method that matches UserRole names
//        }
//        return userRoles;
//    }

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Additional fields for OAuth2
    private String provider;
    private String providerId;
    private String profilePictureUrl;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
            .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
            .toList();
    }

    @Override
    public String getUsername() {
        return email;
    }


    @Override
    public boolean isAccountNonLocked() {
        return isActive;
    }

    @Override
    public boolean isEnabled() {
        return isActive;
    }


    public enum UserRole {
        USER,
        HOST,
        TOURIST,
        ADMIN,
        GUEST,
        MODERATOR
    }

    // Helper methods
    public String getFullName() {
        return firstName + " " + lastName;
    }

    public void updateProfile(String firstName, String lastName, String phoneNumber, String bio) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.bio = bio;
        this.updatedAt = LocalDateTime.now();
    }

    public void updatePreferences(String preferredLanguage, String preferredCurrency, String timeZone) {
        this.preferredLanguage = preferredLanguage;
        this.preferredCurrency = preferredCurrency;
        this.timeZone = timeZone;
        this.updatedAt = LocalDateTime.now();
    }

    public void verify() {
        this.isVerified = true;
        this.verificationToken = null;
        this.verificationTokenExpiry = null;
        this.updatedAt = LocalDateTime.now();
    }

    public void deactivate() {
        this.isActive = false;
        this.updatedAt = LocalDateTime.now();
    }

    public void activate() {
        this.isActive = true;
        this.updatedAt = LocalDateTime.now();
    }

//    public void setRoles(List<UserRole> singletonList) {
//        // TODO Auto-generated method stub
//        throw new UnsupportedOperationException("Unimplemented method 'setRoles'");
//    }
}
