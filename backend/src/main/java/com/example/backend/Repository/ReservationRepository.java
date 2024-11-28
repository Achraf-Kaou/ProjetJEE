package com.example.backend.Repository;

import com.example.backend.Entity.Reservation;
import com.example.backend.Entity.Ride;
import com.example.backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation,Long> {
    List<Reservation>  findReservationsByPassenger(User passenger);
    List<Reservation>  findReservationsByRide(Ride ride);
    List<Reservation> findReservationsByRideAndStatus(Ride ride, String status);
}
