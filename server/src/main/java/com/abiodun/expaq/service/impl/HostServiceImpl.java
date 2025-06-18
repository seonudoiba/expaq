package com.abiodun.expaq.service.impl;

import com.abiodun.expaq.dto.UserDTO;
import com.abiodun.expaq.exception.ResourceNotFoundException;
import com.abiodun.expaq.model.Role;
import com.abiodun.expaq.model.User;
import com.abiodun.expaq.repository.RoleRepository;
import com.abiodun.expaq.repository.UserRepository;
import com.abiodun.expaq.dto.request.BecomeHostRequest;
import com.abiodun.expaq.service.HostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class HostServiceImpl implements HostService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    @Transactional
    public UserDTO applyToBecomeHost(BecomeHostRequest request, UUID userId) {
        // Get the user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Find the HOST role
        Role hostRole = roleRepository.findByName("HOST");
        if (hostRole == null) {
            throw new ResourceNotFoundException("Host role not found");
        }

        // Check if user is already a host
        if (user.getRoles().stream().anyMatch(role -> "HOST".equals(role.getName()))) {
            throw new RuntimeException("User is already a host");
        }

        // Update user details from the form
        user.setDisplayName(request.getDisplayName());
        user.setPhoneNumber(request.getPhoneNumber());
        
        // Add HOST role to user
        user.getRoles().add(hostRole);
        userRepository.save(user);

        // TODO: Save additional host details to a separate table if needed
        // TODO: Implement approval workflow if required

UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setEmail(user.getEmail());
        userDTO.setDisplayName(user.getDisplayName());
        userDTO.setPhoneNumber(user.getPhoneNumber());
        userDTO.setRoles(user.getRoles());

        return userDTO;

        // Uncomment if you want to return a success message
//        return new UserDTO(true, "Successfully applied to become a host");
    }
}
