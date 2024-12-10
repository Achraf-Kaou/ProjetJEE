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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Service
public class ReviewServiceImp implements ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;
    private UserRepository userRepository;
    private RideRepository rideRepository;
    private ReservationRepository reservationRepository;

    @Override
    public ResponseEntity<Review> addReview(Review review) {
        Optional<User> managedReviewer = userRepository.findById(review.getReviewer().getIdUser());
        Optional<User> managedReviewed = userRepository.findById(review.getReviewed().getIdUser());
        if (managedReviewer.isPresent() && managedReviewed.isPresent()) {
            review.setReviewer(managedReviewer.get());
            review.setReviewed(managedReviewed.get());
            review.setDateReview((Timestamp.valueOf(LocalDateTime.now())));
            return ResponseEntity.status(HttpStatus.OK).body(reviewRepository.save(review));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);

    }

    @Override
    public ResponseEntity<Review> updateReview(Review review) {
        return ResponseEntity.status(HttpStatus.OK).body(reviewRepository.save(review));
    }

    @Override
    public ResponseEntity<Double> getMeanReviewByUser(Long idUser) {
        double meanReview = 0.0;
        Optional<User> oUser = userRepository.findById(idUser);
        if(oUser.isPresent()) {
            User reviewed = oUser.get();
            List<Review> reviews = reviewRepository.findReviewByReviewed(reviewed);
            if (reviews != null && !reviews.isEmpty()) {
                meanReview = reviews.stream()
                        .mapToInt(Review::getReview)
                        .average()
                        .orElse(0.0);
            }
            return ResponseEntity.status(HttpStatus.OK).body(meanReview);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @Override
    public ResponseEntity<Double> getMeanReviewByRide(Long idRide) {
        double meanReview = 0.0;
        Optional<Ride> oRide = rideRepository.findById(idRide);
        if(oRide.isPresent()) {
            Ride ride = oRide.get();
            List<Review> reviews = reviewRepository.findReviewByRide(ride);
            if (reviews != null && !reviews.isEmpty()) {
                meanReview = reviews.stream()
                        .mapToInt(Review::getReview)
                        .average()
                        .orElse(0.0);
            }
            return ResponseEntity.status(HttpStatus.OK).body(meanReview);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @Override
    public ResponseEntity<String> deleteReview(Long idReview) {
        reviewRepository.deleteById(idReview);
        return ResponseEntity.status(HttpStatus.OK).body("Review deleted Successfully");
    }

    @Override
    public ResponseEntity<List<Review>> getAllReviewByRide(Long idRide) {
        Optional<Ride> oRide = rideRepository.findById(idRide);
        if(oRide.isPresent()) {
            Ride ride = oRide.get();
            List<Review> reviews = reviewRepository.findReviewByRide(ride);
            return ResponseEntity.status(HttpStatus.OK).body(reviews);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
    @Override
    public ResponseEntity<List<Reservation>> getNotReviewedPassengerByRide(Long idRide) {
        Optional<Ride> oRide = rideRepository.findById(idRide);
        if(oRide.isPresent()){
            Ride ride = oRide.get();
            List<Reservation> reservations =reservationRepository.findReservationsByRide(ride);
            List<Reservation> notReviewedReservations = new ArrayList<>();
            if(reservations != null){
                for(Reservation r: reservations){
                    Optional<Review> review = reviewRepository.findReviewByReviewerAndReviewedAndRide(r.getRide().getDriver(),r.getPassenger(),r.getRide());
                    if(review.isEmpty()){
                        notReviewedReservations.add(r);
                    }
                }
                return ResponseEntity.status(HttpStatus.OK).body(notReviewedReservations);
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @Override
    public ResponseEntity<List<Ride>> getNotReviewedRides(Long idUser) {
        ///terminateRides();
        List<Ride> notReviewedRides = new ArrayList<>();
        Optional<User> user = userRepository.findById(idUser);
        if(user.isPresent()) {
            List<Ride> rides = rideRepository.findByDriverAndStatus(user.get() , "Terminé" );
            List<Reservation> reservations = reservationRepository.findReservationsByPassengerAndStatus(user.get() , "Terminé" );
            System.out.println(reservations);
            for (Reservation reservation : reservations){
                Optional<Ride> ride = rideRepository.findById(reservation.getRide().getIdRide());
                if(ride.isPresent()) {
                    Optional<Review> review = reviewRepository.findReviewByReviewerAndRide(user.get() , ride.get());
                    if(review.isEmpty()) {
                        notReviewedRides.add(ride.get());
                    }
                }
            }

            for (Ride ride : rides){
                ResponseEntity<List<Reservation>> response = getNotReviewedPassengerByRide(ride.getIdRide());
                if (response.getStatusCode() == HttpStatus.OK) {

                    List<Reservation> res = response.getBody();
                    if (res != null && !res.isEmpty()) {
                        notReviewedRides.add(ride);
                    }
                }
                //Optional<Review> review = reviewRepository.findReviewByReviewerAndRide(user.get() , ride);
                //if(review.isEmpty()) {
                //   notReviewedRides.add(ride);
                //}
            }
        }
        return ResponseEntity.status(HttpStatus.OK).body(notReviewedRides);
    }

    @Override
    public ResponseEntity<Review> getReviewByReviewedAndRide(Long idReviewed, Long idRide){
        Optional<User> oReviewed = userRepository.findById(idReviewed);
        Optional<Ride> oRide = rideRepository.findById(idRide);
        if(oReviewed.isPresent() && oRide.isPresent()){
            User reviewed = oReviewed.get();
            Ride ride = oRide.get();
            Optional<Review> review = reviewRepository.findReviewByReviewedAndRide(reviewed, ride);
            return review.map(value -> ResponseEntity.status(HttpStatus.OK).body(value)).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
}

























