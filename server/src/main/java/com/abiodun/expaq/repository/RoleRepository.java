package com.abiodun.expaq.repository;

import com.abiodun.expaq.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RoleRepository extends JpaRepository<Role, UUID> {
    Role findByName(String name);
    Boolean existsByName(String name);
}