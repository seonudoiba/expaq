package com.abiodun.expaq.repository;

import com.abiodun.expaq.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUserName(String userName);

    boolean existsByEmail(String email);

    boolean existsByUserName(String email);

    Integer findIdByUserName(String userName);


}
