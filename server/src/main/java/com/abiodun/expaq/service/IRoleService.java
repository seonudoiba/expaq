package com.abiodun.expaq.service;

import com.abiodun.expaq.exception.RoleAlreadyExistException;
import com.abiodun.expaq.model.Role;
import com.abiodun.expaq.model.User;

import java.util.List;
import java.util.UUID;

public interface IRoleService {
    List<Role> getRoles();
    Role createRole(Role theRole) throws RoleAlreadyExistException;
    void deleteRole(UUID roleId);
    Role removeAllUsersFromRole(UUID roleId);
    User removeUserFromRole(UUID userId, UUID roleId);
    User assignRoleToUser(UUID userId, User.UserRole userRole);
    User updateUserRole(UUID userId, User.UserRole newRole);
    List<User> getUsersByRole(User.UserRole role);
    User.UserRole getUserRole(UUID userId);
}