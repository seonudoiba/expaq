package com.abiodun.expaq.service;

import com.abiodun.expaq.exception.RoleAlreadyExistException;
import com.abiodun.expaq.model.Role;
import com.abiodun.expaq.model.User;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface IRoleService {
    List<Role> getRoles();
    Role createRole(Role theRole) throws RoleAlreadyExistException;
    void deleteRole(UUID roleId);
    Role removeAllUsersFromRole(UUID roleId);
    User removeUserFromRole(UUID userId, UUID roleId);
    User assignRoleToUser(UUID userId, Role userRole);
    User updateUserRole(UUID userId, Role newRole);
    List<User> getUsersByRole(Role role);
    Set<Role> getUserRoles(UUID userId);
}