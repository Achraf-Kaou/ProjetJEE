package com.example.backend.Service;

import com.example.backend.Entity.Reservation;
import com.example.backend.Entity.Review;
import com.example.backend.Entity.Ride;
import com.example.backend.Entity.User;
import com.example.backend.Repository.ReservationRepository;
import com.example.backend.Repository.ReviewRepository;
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
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Service
public class RideServiceImp implements RideService{
    @Autowired
    private RideRepository rideRepository;
    private UserRepository userRepository;
    private ReviewRepository reviewRepository;
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
    @Override
    public ResponseEntity<List<Ride>> getFilteredRides(String depart, String destination, Double price, Timestamp dateRide) {
        System.out.println("depart="+depart);
        System.out.println("destination="+destination);
        System.out.println("price="+price);
        System.out.println("dateRide="+dateRide);
        List<Ride> ListRide = new ArrayList<>();
        Timestamp now = new Timestamp(System.currentTimeMillis());
        Timestamp finalDateRide = (dateRide != null && dateRide.after(now)) ? dateRide : now;
        List<Ride> rides  = rideRepository.findRidesByFilters(depart, destination, price, finalDateRide);
        for(Ride ride : rides) {
            if(ride.getDriver()!=null){
                ListRide.add(ride);
            }
        }
        return ResponseEntity.status(HttpStatus.OK).body(ListRide);
    }



    @Override
    public ResponseEntity<?> terminateRides() {
        List<Ride> rides = rideRepository.findByStatus("En-Cours");
        System.out.println("terminate rides :"+rides);
        Timestamp now = new Timestamp(System.currentTimeMillis());
        for(Ride ride : rides){
            if (ride.getDateRide().before(now)) {
                List<Reservation> reservations = reservationRepository.findReservationsByRide(ride);
                ride.setStatus("Terminé");
                rideRepository.save(ride);
                for (Reservation reservation : reservations){
                    reservation.setStatus("Terminé");
                    reservationRepository.save(reservation);
                }
            }
        }
        return ResponseEntity.status(HttpStatus.OK).body("Rides Terminated Sucessfully");
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
        Optional<Ride> or = rideRepository.findById(idRide);
        if (or.isPresent()) {
            Ride ride = or.get();
            LocalDateTime currentDate = LocalDateTime.now();
            LocalDateTime rideDate = ride.getDateRide().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
            if (rideDate.isAfter(currentDate)) {
                rideRepository.deleteById(idRide);
                return ResponseEntity.status(HttpStatus.OK).body("Ride deleted Successfully");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("can not delete ride date passed");
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @Override
    public ResponseEntity<Ride> updateRide(Ride ride) {
        if(ride.getStatus().equals("En-Cours")){
            notificationService.notifyPassengersAboutRideUpdate(ride);
            return ResponseEntity.status(HttpStatus.OK).body(rideRepository.save(ride));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }

    @Override
    public ResponseEntity<List<Ride>> getAllRides() {
        return ResponseEntity.status(HttpStatus.OK).body(rideRepository.findAll());
    }

    @Override
    public ResponseEntity<Ride> addRide(Ride ride) {
        Timestamp now = new Timestamp(System.currentTimeMillis());
        if (ride.getDateRide().after(now)) {
            ride.setStatus("En-Cours");
            return ResponseEntity.status(HttpStatus.OK).body(rideRepository.save(ride));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }
}
