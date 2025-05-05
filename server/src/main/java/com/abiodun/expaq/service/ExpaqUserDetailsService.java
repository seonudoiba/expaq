package com.abiodun.expaq.service;

import com.abiodun.expaq.model.ExpaqUserDetails;
import com.abiodun.expaq.model.User;
import com.abiodun.expaq.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class ExpaqUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public ExpaqUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> userOptional = userRepository.findByUserName(username);
        if(userOptional.isEmpty()) {
            throw new UsernameNotFoundException(username);
        }
        return new ExpaqUserDetails(userOptional.get());
    }
}