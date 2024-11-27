package com.example.backend.Controller;

import com.example.backend.Entity.Reservation;
import com.example.backend.Service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/reservation")
@RestController
public class ReservationController {
    @Autowired
    private ReservationService reservationService;

    @GetMapping("/getAllReservations")
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return reservationService.getAllReservations();
    }
    @PostMapping("/addReservation/{idPassenger}/{idRide}")
    public ResponseEntity<Reservation> addReservation(@PathVariable Long idPassenger,@PathVariable Long idRide) {
        return reservationService.addReservation(idPassenger,idRide);
    }
    @PutMapping("/cancelReservation/{idReservation}")
    public ResponseEntity<Reservation> cancelReservation(@PathVariable Long idReservation) {
        return reservationService.cancelReservation(idReservation);
    }
    @GetMapping("/getAllReservationByUser/{idUser}")
    public ResponseEntity<List<Reservation>> getAllReservationByUser(@PathVariable Long idUser) {
        return reservationService.getAllReservationByUser(idUser);
    }
    @GetMapping("/getAllReservationByRide/{idRide}")
    public ResponseEntity<List<Reservation>> getAllReservationByRide(@PathVariable Long idRide) {
        return reservationService.getAllReservationByRide(idRide);
    }
}
