package com.abiodun.expaq.repository;

import com.abiodun.expaq.models.BlogModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlogRepository extends JpaRepository<BlogModel,Integer> {
    
}
