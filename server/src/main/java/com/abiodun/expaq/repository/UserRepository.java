package com.abiodun.expaq.repository;

import com.abiodun.expaq.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);

    void deleteByEmail(String email);
    List<User> findByHostStatusEquals(String hostStatus);


    Optional<User> findByEmail(String email);
}
