package com.example.backend.Service;

import com.example.backend.Entity.Ride;
import org.springframework.http.ResponseEntity;


import java.util.List;

public interface RideService {
    ResponseEntity<List<Ride>> getAllRideByUser(Long idUser);
    ResponseEntity<Ride> updateRidePlaces(Long idRide, int index );
    ResponseEntity<String> deleteRide(Long idRide);
    ResponseEntity<Ride> updateRide(Ride ride);
    ResponseEntity<List<Ride>> getAllRides();
    ResponseEntity<Ride> addRide(Ride  ride,Long idDriver);
}
