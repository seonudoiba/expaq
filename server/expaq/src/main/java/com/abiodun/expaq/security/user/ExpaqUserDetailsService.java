package com.abiodun.expaq.security.user;

import com.abiodun.expaq.models.User;
import com.abiodun.expaq.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ExpaqUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public ExpaqUserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return ExpaqUserDetails.buildUserDetails(user);


    }
}
