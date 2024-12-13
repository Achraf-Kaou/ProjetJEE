package com.example.backend.Repository;


import com.example.backend.Entity.Review;
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
    List<Ride> findByStatus(String status);
    List<Ride> findByDriver(User user);
    List<Ride> findByDriverAndStatus(User user , String status);

    @Query("SELECT r FROM Ride r WHERE " +
            "(r.places > 0) AND " +
            "(:dateRide IS NULL OR " + // Cas 1 : Si `dateRide` est null, ignorer la condition
            " (EXISTS (SELECT 1 FROM Ride r2 WHERE r2.dateRide = :dateRide) AND r.dateRide = :dateRide) OR " +
            " (NOT EXISTS (SELECT 1 FROM Ride r2 WHERE r2.dateRide = :dateRide) AND FUNCTION('DATE', r.dateRide) = FUNCTION('DATE', :dateRide))) AND " +
            "(:depart IS NULL  OR LOWER(r.depart) LIKE CONCAT('%', LOWER(:depart), '%')) AND " +
            "(:destination IS NULL OR LOWER(r.destination) LIKE CONCAT('%', LOWER(:destination), '%')) AND " +
            "(:price IS NULL OR r.price <= :price)")
    List<Ride> findRidesByFilters(@Param("depart") String depart,
                                  @Param("destination") String destination,
                                  @Param("price") Double price,
                                  @Param("dateRide") Timestamp dateRide);

}
