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
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Service
public class ReservationServiceImp implements ReservationService {
    @Autowired
    private ReservationRepository reservationRepository;
    private RideRepository rideRepository;
    private UserRepository userRepository;
    private RideService rideService;
    @Override
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return ResponseEntity.status(HttpStatus.OK).body(reservationRepository.findAll());
    }

    @Override
    public ResponseEntity<Reservation> addReservation(Long idPassenger, Long idRide) {
        Optional<User> oPassenger = userRepository.findById(idPassenger);
        Optional<Ride> oRide = rideRepository.findById(idRide);
        if (oPassenger.isPresent() && oRide.isPresent()) {
            User passenger = oPassenger.get();
            Ride ride = oRide.get();
            Reservation reservation0 = reservationRepository.findByPassengerAndRide(passenger, ride);
            if(reservation0 != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(reservation0);
            }
            Reservation reservation = new Reservation();
            reservation.setRide(ride);
            reservation.setPassenger(passenger);
            reservation.setDateReservation(Timestamp.valueOf(LocalDateTime.now()));
            reservation.setStatus("En-cours");
            rideService.updateRidePlaces(reservation.getRide().getIdRide() , 0);
            return ResponseEntity.status(HttpStatus.OK).body(reservationRepository.save(reservation));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @Override
    public ResponseEntity<Reservation> cancelReservation(Long idReservation) {
        Optional<Reservation> oReservation = reservationRepository.findById(idReservation);
        if (oReservation.isPresent()) {
            Reservation reservation = oReservation.get();
            reservation.setStatus("Annulée");
            rideService.updateRidePlaces(reservation.getRide().getIdRide() , 1);
            return ResponseEntity.status(HttpStatus.OK).body(reservationRepository.save(reservation));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @Override
    public ResponseEntity<List<Reservation>> getAllReservationByUser(Long idUser) {
        Optional<User> oPassenger = userRepository.findById(idUser);
        if(oPassenger.isPresent()){
            User passenger = oPassenger.get();
            List<Reservation> reservations =reservationRepository.findReservationsByPassenger(passenger);
            return ResponseEntity.status(HttpStatus.OK).body(reservations);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @Override
    public ResponseEntity<List<Reservation>> getAllReservationByRide(Long idRide) {
        Optional<Ride> oRide = rideRepository.findById(idRide);
        if(oRide.isPresent()){
            Ride ride = oRide.get();
            List<Reservation> reservations =reservationRepository.findReservationsByRide(ride);
            return ResponseEntity.status(HttpStatus.OK).body(reservations);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @Override
    public ResponseEntity<List<Reservation>> getAllReservationByRideAndStatus(Long idRide, String status) {
        Optional<Ride> oRide = rideRepository.findById(idRide);
        if(oRide.isPresent()){
            Ride ride = oRide.get();
            List<Reservation> reservations =reservationRepository.findReservationsByRideAndStatus(ride, status);
            return ResponseEntity.status(HttpStatus.OK).body(reservations);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @Override
    public ResponseEntity<Reservation> getReservationByPassangerAndRide (Long idPassenger, Long idRide){
        Optional<User> oPassenger = userRepository.findById(idPassenger);
        Optional<Ride> oRide = rideRepository.findById(idRide);
        if(oPassenger.isPresent() && oRide.isPresent()){
            User passenger = oPassenger.get();
            Ride ride = oRide.get();
            Reservation reservation =reservationRepository.findByPassengerAndRide(passenger,ride);
            return ResponseEntity.status(HttpStatus.OK).body(reservation);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

}
