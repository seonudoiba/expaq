package com.abiodun.expaq.repository;

import com.abiodun.expaq.model.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface CityRepository extends JpaRepository<City, UUID> {
    
    @Query("SELECT c, COUNT(a) as activityCount " +
           "FROM City c " +
           "LEFT JOIN c.activities a " +
           "GROUP BY c")
    List<Object[]> findAllWithActivityCount();
    
    @Query("SELECT c, COUNT(a) as activityCount " +
           "FROM City c " +
           "LEFT JOIN c.activities a " +
           "WHERE c.id = :id " +
           "GROUP BY c")
    List<Object[]> findByIdWithActivityCount(@Param("id") UUID id);
    
    @Query("SELECT c, COUNT(a) as activityCount " +
           "FROM City c " +
           "LEFT JOIN c.activities a " +
           "WHERE c.country.id = :countryId " +
           "GROUP BY c")
    List<Object[]> findByCountryIdWithActivityCount(@Param("countryId") UUID countryId);
}
