package com.abiodun.expaq.repository;

import com.abiodun.expaq.model.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface CountryRepository extends JpaRepository<Country, UUID> {
    
    @Query("SELECT c, COUNT(DISTINCT city) as cityCount, COUNT(a) as activityCount " +
           "FROM Country c " +
           "LEFT JOIN c.cities city " +
           "LEFT JOIN city.activities a " +
           "GROUP BY c")
    List<Object[]> findAllWithCityAndActivityCount();
    
    @Query("SELECT c, COUNT(DISTINCT city) as cityCount, COUNT(a) as activityCount " +
           "FROM Country c " +
           "LEFT JOIN c.cities city " +
           "LEFT JOIN city.activities a " +
           "WHERE c.id = :id " +
           "GROUP BY c")
    List<Object[]> findByIdWithCityAndActivityCount(@Param("id") UUID id);
}
