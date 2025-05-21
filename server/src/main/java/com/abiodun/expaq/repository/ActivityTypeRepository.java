package com.abiodun.expaq.repository;

import com.abiodun.expaq.model.ActivityType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ActivityTypeRepository extends JpaRepository<ActivityType, UUID> {
}
