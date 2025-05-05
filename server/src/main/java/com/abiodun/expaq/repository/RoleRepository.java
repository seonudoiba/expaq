package com.abiodun.expaq.repository;

import com.abiodun.expaq.model.Role;
import com.abiodun.expaq.model.User;
import com.abiodun.expaq.model.User.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RoleRepository extends JpaRepository<Role, UUID> {
    Role findByName(String name);
    boolean existsByName(String name);
}