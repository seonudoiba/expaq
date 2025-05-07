package com.abiodun.expaq.model;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.UUID;

public class ExpaqUserDetails implements UserDetails {
    private final User user;

    public ExpaqUserDetails(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Return a single authority based on the Role enum
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRoles()));
    }

    @Override
    public String getPassword() {
        return user.getPassword(); // Use passwordHash field
    }


    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public UUID getId() {
        return this.user.getId();
    }
}
