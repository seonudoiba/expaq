package com.abiodun.expaq.repository;

import com.abiodun.expaq.model.Country;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CountryRepository extends JpaRepository<Country, UUID> {
}
