package com.abiodun.expaq.service;

import com.abiodun.expaq.exception.UserAlreadyExistsException;
import com.abiodun.expaq.model.ExpaqUserDetails;
import com.abiodun.expaq.model.Role;
import com.abiodun.expaq.model.User;
import com.abiodun.expaq.repository.RoleRepository;
import com.abiodun.expaq.repository.UserRepository;
import com.abiodun.expaq.request.LoginRequest;
import com.abiodun.expaq.response.AuthResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RoleRepository roleRepository;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder, AuthenticationManager authenticationManager, JwtService jwtService, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.roleRepository = roleRepository;
    }

    public User register(User user) {

        if (userRepository.existsByEmail(user.getEmail())){
            throw new UserAlreadyExistsException(user.getEmail() + " already exists");
        }
        if (userRepository.existsByUserName(user.getUserName())){
            throw new UserAlreadyExistsException(user.getUserName() + "2 already exists");
        }

        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        System.out.println(user.getUserName());

        Role userRole = roleRepository.findByName("GUEST");
        user.setRoles(Collections.singletonList(userRole));
        return userRepository.save(user);


    }

    public AuthResponse verify(LoginRequest user) {
        Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getUserName(),
                        user.getPassword()
                )
        );

        if (authenticate.isAuthenticated()) {
            User authenticatedUser = userRepository.findByUserName(user.getUserName());

            String token = jwtService.generateToken(authenticatedUser);
//            List<String> roles = authenticatedUser.getRoles().stream()
//                    .map(Role::getName)
//                    .collect(Collectors.toList());

            ExpaqUserDetails userPrincipal = (ExpaqUserDetails) authenticate.getPrincipal();

            List<String> roles = userPrincipal.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();

            return new AuthResponse(authenticatedUser.getUserName(), token, roles);
        }

        throw new RuntimeException("Authentication failed");
    }

//    public List<ExpaqUserDetails> getAllUser() {
//        return Collections.singletonList((ExpaqUserDetails) userRepository.findAll());
//    }

//    public ExpaqUserDetails getUser(Integer id) {
//        return (ExpaqUserDetails) userRepository.findById(Long.valueOf(id));
//    }
}
