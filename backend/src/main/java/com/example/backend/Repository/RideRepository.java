package com.example.backend.Repository;


import com.example.backend.Entity.Ride;
import com.example.backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface RideRepository extends JpaRepository<Ride,Long> {
    List<Ride> findByDriver(User user);
    @Query("SELECT r FROM Ride r WHERE " +
            "(r.places > 0) AND " +
            "(r.dateRide > :dateRide) AND " +
            "(:depart IS NULL OR LOWER(r.depart) LIKE LOWER(:depart)) AND " +
            "(:destination IS NULL OR LOWER(r.destination) LIKE LOWER(:destination)) AND " +
            "(:price IS NULL OR r.price <= :price)")
    List<Ride> findRidesByFilters(@Param("depart") String depart,
                                  @Param("destination") String destination,
                                  @Param("price") Double price,
                                  @Param("dateRide") Timestamp dateRide);

}
