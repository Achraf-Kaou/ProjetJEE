package com.example.backend.Service;

import com.example.backend.Entity.Reservation;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ReservationService {
    ResponseEntity<List<Reservation>> getAllReservations();
    ResponseEntity<Reservation> addReservation(Long idPassenger, Long idRide);
    ResponseEntity<Reservation> cancelReservation(Long idReservation);
    ResponseEntity<List<Reservation>> getAllReservationByUser(Long idUser);
    ResponseEntity<List<Reservation>> getAllReservationByRide(Long idRide);
}
