package com.example.backend.Service;

import com.example.backend.Entity.Ride;
import com.example.backend.Entity.User;
import com.example.backend.Repository.RideRepository;
import com.example.backend.Repository.UserRepository;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Service
public class RideServiceImp implements RideService{
    @Autowired
    private RideRepository rideRepository;
    private UserRepository userRepository;

    @Override
    public ResponseEntity<List<Ride>> getAllRideByUser(Long idUser) {
        Optional<User> user = userRepository.findById(idUser);
        if(user.isPresent()) {
            List<Ride> rides = rideRepository.findByDriver(user.get());
            return ResponseEntity.status(HttpStatus.OK).body(rides);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @Override
    public ResponseEntity<Ride> updateRidePlaces(Long idRide, int index) {
        Optional<Ride> or = rideRepository.findById(idRide);
        if(or.isPresent()) {
            Ride ride = or.get();
            if(index == 0){
                ride.setPlaces(ride.getPlaces()-1);
            }else{
                ride.setPlaces(ride.getPlaces()+1);
            }
            return ResponseEntity.status(HttpStatus.OK).body(rideRepository.save(ride));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @Override
    public ResponseEntity<String> deleteRide(Long idRide) {
        rideRepository.deleteById(idRide);
        return ResponseEntity.status(HttpStatus.OK).body("Ride deleted Successfully");
    }

    @Override
    public ResponseEntity<Ride> updateRide(Ride ride) {
        return ResponseEntity.status(HttpStatus.OK).body(rideRepository.save(ride));
    }

    @Override
    public ResponseEntity<List<Ride>> getAllRides() {
        return ResponseEntity.status(HttpStatus.OK).body(rideRepository.findAll());
    }

    @Override
    public ResponseEntity<Ride> addRide(Ride ride, Long idDriver) {
        Optional<User> user = userRepository.findById(idDriver);
        if(user.isPresent()) {
            ride.setDriver(user.get());
            return ResponseEntity.status(HttpStatus.OK).body(rideRepository.save(ride));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
}
