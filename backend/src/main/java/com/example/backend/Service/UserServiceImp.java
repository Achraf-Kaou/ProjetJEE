package com.example.backend.Service;

import com.example.backend.Entity.Reservation;
import com.example.backend.Entity.Review;
import com.example.backend.Entity.Ride;
import com.example.backend.Entity.User;
import com.example.backend.Repository.ReservationRepository;
import com.example.backend.Repository.ReviewRepository;
import com.example.backend.Repository.RideRepository;
import com.example.backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImp implements UserService{
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private RideRepository rideRepository;
    @Autowired
    private ReservationService reservationService;
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private RideService rideService;

    @Override
    public ResponseEntity<User> signIn(String email, String password) {
        Optional<User> userOptional =userRepository.findUserByEmail(email);
        if(userOptional.isPresent()) {
            User user = userOptional.get();
            if(user.getPassword().equals(password)) {
                return ResponseEntity.ok().body(user);
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }else{
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }}

    @Override
    public ResponseEntity<List<User>> getUserByName(String firstName ,String lastName) {
        List<User> oFN = userRepository.findUserByLastName(firstName);
        List<User> oLN = userRepository.findUserByFirstName(lastName);
        List<User> users = new ArrayList<>();
        users.addAll(oFN);
        users.addAll(oLN);
        users = users.stream().distinct().toList();
        if (users.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }else{
            return ResponseEntity.status(HttpStatus.OK).body(users);
        }
    }

    @Override
    public ResponseEntity<User> getUserById(Long idUser) {
        Optional<User> oUser = userRepository.findById(idUser);
        if(oUser.isPresent()) {
            User user = oUser.get();
            return ResponseEntity.ok().body(user);
        }else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @Override
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.status(HttpStatus.OK).body(userRepository.findAll());
    }

    @Override
    public ResponseEntity<?> signUp(User user) {
        Optional<User> oUser = userRepository.findUserByEmail(user.getEmail());
        if(oUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email already exist");
        }
        return ResponseEntity.status(HttpStatus.OK).body(userRepository.save(user));
    }

    @Override
    public ResponseEntity<User> updateUser(User user) {
        System.out.println(user);
        return ResponseEntity.status(HttpStatus.OK).body(userRepository.save(user));
    }

    @Override
    public ResponseEntity<String> deleteUser(Long idUser) {
        Optional<User> ouser = userRepository.findById(idUser);
        if (ouser.isPresent()) {
            User user = ouser.get();
            // canceling all reservations for this user and setting value of passanger null
            List<Reservation> reservations = reservationRepository.findReservationsByPassenger(user);
            for (Reservation reservation : reservations) {
                if (reservation.getStatus().equals("En-cours")) {
                    reservationService.cancelReservation(reservation.getIdReservation());
                }
                reservation.setPassenger(null);
                reservationRepository.save(reservation);
            }
            // deleting rides that did not happen
            // or keeping the ride setting the driver for null if the ride happened (bch yo3ed lel user acces lel historique)
            List<Ride> rides = rideRepository.findByDriver(user);
            Timestamp now = new Timestamp(System.currentTimeMillis());
            for (Ride ride : rides) {
                if (ride.getDateRide().before(now)) {
                    ride.setDriver(null);
                    rideRepository.save(ride);

                } else {
                    System.out.println("Ride " + ride);
                    rideService.deleteRide(ride.getIdRide());
                    System.out.println("ok2");

                }
            }
            System.out.println("ok");
            // setting user null where he is a reviewer or a reviewed to keep track
            List<Review> reviewer = reviewRepository.findReviewByReviewer(user);
            for (Review review : reviewer) {
                review.setReviewer(null);
                reviewRepository.save(review);
            }
            List<Review> reviewed = reviewRepository.findReviewByReviewed(user);
            for (Review review : reviewed) {
                review.setReviewed(null);
                reviewRepository.save(review);
            }
            userRepository.deleteById(idUser);
            return ResponseEntity.ok().body("User deleted successfully");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

}

