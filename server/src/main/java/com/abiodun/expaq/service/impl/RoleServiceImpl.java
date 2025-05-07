package com.abiodun.expaq.service.impl;

import com.abiodun.expaq.exception.RoleAlreadyExistException;
import com.abiodun.expaq.exception.RoleNotFoundException;
import com.abiodun.expaq.exception.UserNotFoundException;
import com.abiodun.expaq.model.Role;
import com.abiodun.expaq.model.User;
import com.abiodun.expaq.model.Role;
import com.abiodun.expaq.repository.RoleRepository;
import com.abiodun.expaq.repository.UserRepository;
import com.abiodun.expaq.service.IRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements IRoleService {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    @Override
    public List<Role> getRoles() {
        return roleRepository.findAll();
    }

    @Override
    public Role createRole(Role theRole) throws RoleAlreadyExistException {
        if (roleRepository.existsByName(theRole.getName())) {
            throw new RoleAlreadyExistException("Role already exists: " + theRole.getName());
        }
        return roleRepository.save(theRole);
    }
//    @Override
//    public Role createRole(Role theRole) {
//        if (roleRepository.existsByName(theRole.getName())) {
//            throw new RoleAlreadyExistException("Role already exists: " + theRole.getName());
//        }
//        return roleRepository.save(theRole);
//    }


    @Override
    public void deleteRole(UUID roleId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RoleNotFoundException("Role not found with id: " + roleId));
        roleRepository.delete(role);
    }

    @Override
    public Role removeAllUsersFromRole(UUID roleId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RoleNotFoundException("Role not found with id: " + roleId));

        List<User> users = userRepository.findByRolesName(role.getName());

        for (User user : users) {
            user.setRoles(null);
            userRepository.save(user);
        }
        return role;
    }

    @Override
    public User removeUserFromRole(UUID userId, UUID roleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RoleNotFoundException("Role not found with id: " + roleId));


        if (user.getRoles() != null && user.getRoles().contains(role)) {
            user.setRoles(null);
            return userRepository.save(user);
        }
        throw new IllegalArgumentException("User does not belong to the specified role");
    }

    @Override
    public User assignRoleToUser(UUID userId, Role userRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
        user.setRoles(Collections.singleton(userRole));
        return userRepository.save(user);
    }

    @Override
    public User updateUserRole(UUID userId, Role newRole) {
        return assignRoleToUser(userId, newRole);
    }

    @Override
    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRolesName(role.getName());
    }

    @Override
    public Set<Role> getUserRoles(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
        return user.getRoles();
    }
}
