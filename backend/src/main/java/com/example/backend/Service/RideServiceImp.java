package com.example.backend.Service;

import com.example.backend.Entity.Reservation;
import com.example.backend.Entity.Ride;
import com.example.backend.Entity.User;
import com.example.backend.Repository.ReservationRepository;
import com.example.backend.Repository.RideRepository;
import com.example.backend.Repository.UserRepository;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Service
public class RideServiceImp implements RideService{
    @Autowired
    private RideRepository rideRepository;
    private UserRepository userRepository;
    private NotificationService notificationService;
    private ReservationRepository reservationRepository;


    @Override
    public ResponseEntity<List<Ride>> getAllRideByUser(Long idUser) {
        Optional<User> user = userRepository.findById(idUser);
        if(user.isPresent()) {
            List<Ride> rides = rideRepository.findByDriver(user.get());
            return ResponseEntity.status(HttpStatus.OK).body(rides);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    public ResponseEntity<List<Ride>> getFilteredRides(String depart, String destination, Double price, Timestamp dateRide) {
        Timestamp now = new Timestamp(System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.OK)
                .body(rideRepository.findRidesByFilters(depart, destination, price,  dateRide != null ? dateRide : now));
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
            notificationService.notifyDriverAboutRidePlaces(ride);
            return ResponseEntity.status(HttpStatus.OK).body(rideRepository.save(ride));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @Override
    public ResponseEntity<String> deleteRide(Long idRide) {
        Optional<Ride> or = rideRepository.findById(idRide);
        // if we don't have that ride
        if (or.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ride not found");
        }
        System.out.println("not empty");
        // if Ride happened there is no deleting (comme quoi review policy)
        Ride ride = or.get();
        Timestamp now = new Timestamp(System.currentTimeMillis());
        if (ride.getDateRide().before(now)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot delete past rides");
        }
        System.out.println("not passed");
        // send notifications
        notificationService.notifyPassengersAboutRideDelete(idRide);
        // canceling reservations for that ride and the ride itself
        List<Reservation> reservations = reservationRepository.findReservationsByRide(ride);
        for (Reservation reservation : reservations) {
                reservation.setStatus("Annulée");
                reservation.setRide(null);
                reservationRepository.save(reservation);
                rideRepository.save(ride);
        }
        System.out.println("reservation cancelled");
        rideRepository.deleteById(idRide);
        return ResponseEntity.status(HttpStatus.OK).body("Ride deleted Successfully");
    }

    @Override
    public ResponseEntity<Ride> updateRide(Ride ride) {
        notificationService.notifyPassengersAboutRideUpdate(ride);
        return ResponseEntity.status(HttpStatus.OK).body(rideRepository.save(ride));
    }

    @Override
    public ResponseEntity<List<Ride>> getAllRides() {
        return ResponseEntity.status(HttpStatus.OK).body(rideRepository.findAll());
    }

    @Override
    public ResponseEntity<Ride> addRide(Ride ride) {
        return ResponseEntity.status(HttpStatus.OK).body(rideRepository.save(ride));
    }
}
