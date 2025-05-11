package com.abiodun.expaq.service;

import com.abiodun.expaq.model.ExpaqUserDetails;
import com.abiodun.expaq.model.User;
import com.abiodun.expaq.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Component
public class ExpaqUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public ExpaqUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user;
        try {
            // Try to parse as UUID first
            UUID userId = UUID.fromString(username);
            user = userRepository.findById(userId)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with ID: " + username));
        } catch (IllegalArgumentException e) {
            // If not a UUID, try to find by email
            user = userRepository.findByEmail(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
        }

        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }
        
        return new ExpaqUserDetails(user);
    }

//     @Override
//     public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//         Optional<User> userOptional = userRepository.findByUsername(username);
//         if(userOptional.isEmpty()) {
//             throw new UsernameNotFoundException(username);
//         }
//         return new ExpaqUserDetails(userOptional.get());
//     }

}