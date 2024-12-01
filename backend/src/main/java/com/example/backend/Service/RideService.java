package com.example.backend.Service;

import com.example.backend.Entity.Ride;
import org.springframework.http.ResponseEntity;


import java.sql.Timestamp;
import java.util.List;

public interface RideService {
    ResponseEntity<List<Ride>> getAllRideByUser(Long idUser);
    ResponseEntity<Ride> updateRidePlaces(Long idRide, int index );
    ResponseEntity<String> deleteRide(Long idRide);
    ResponseEntity<Ride> updateRide(Ride ride );
    ResponseEntity<List<Ride>> getAllRides();
    ResponseEntity<Ride> addRide(Ride  ride);
    ResponseEntity<List<Ride>> getFilteredRides(String depart, String destination, Double price, Timestamp dateRide);
}
