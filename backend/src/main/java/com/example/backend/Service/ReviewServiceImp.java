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
import java.util.stream.Collectors;

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
        Optional<Ride> oRide = rideRepository.findById(review.getRide().getIdRide());
        if (managedReviewer.isPresent() && managedReviewed.isPresent() && oRide.isPresent()) {
            System.out.println("kollech tamem");
            Optional<Review> testReview = reviewRepository.findReviewByReviewerAndReviewedAndRide(review.getReviewer(),review.getReviewed(),review.getRide());
            System.out.println("test review"+testReview.isPresent());
            if(testReview.isEmpty()){
                review.setReviewer(managedReviewer.get());
                review.setReviewed(managedReviewed.get());
                review.setDateReview((Timestamp.valueOf(LocalDateTime.now())));
                return ResponseEntity.status(HttpStatus.OK).body(reviewRepository.save(review));
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);

    }

    @Override
    public ResponseEntity<Review> updateReview(Review review) {
        review.setDateReview(Timestamp.valueOf(LocalDateTime.now()));
        System.out.println(review);
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

        // Fetch the ride using its ID
        Optional<Ride> oRide = rideRepository.findById(idRide);
        if (oRide.isPresent()) {
            Ride ride = oRide.get();

            // Retrieve reviews for the ride and exclude those made by the driver
            List<Review> passengerReviews = reviewRepository.findReviewByRide(ride).stream()
                    .filter(review -> !review.getReviewer().getIdUser().equals(ride.getDriver().getIdUser()))
                    .collect(Collectors.toList());

            // Calculate the mean review only for passenger reviews
            if (passengerReviews != null && !passengerReviews.isEmpty()) {
                meanReview = passengerReviews.stream()
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
            if (ride.getDriver() == null || ride.getDriver().getIdUser() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(null); // Or return a meaningful message
            }

            Long driverId = ride.getDriver().getIdUser();

            // Filter out reviews where the reviewer is the driver
            List<Review> reviews = reviewRepository.findReviewByRide(ride).stream()
                    .filter(review -> !review.getReviewer().getIdUser().equals(driverId))
                    .toList();
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
                    if(r.getPassenger()!=null){
                        Optional<Review> review = reviewRepository.findReviewByReviewerAndReviewedAndRide(r.getRide().getDriver(),r.getPassenger(),r.getRide());
                        if(review.isEmpty()){
                            notReviewedReservations.add(r);
                        }
                    }
                }
                return ResponseEntity.status(HttpStatus.OK).body(notReviewedReservations);
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @Override
    public ResponseEntity<List<Ride>> getNotReviewedRides(Long idUser) {
        List<Ride> notReviewedRides = new ArrayList<>();
        Optional<User> user = userRepository.findById(idUser);
        if(user.isPresent()) {
            List<Ride> rides = rideRepository.findByDriverAndStatus(user.get() , "Terminé" );
            List<Reservation> reservations = reservationRepository.findReservationsByPassengerAndStatus(user.get() , "Terminé" );
            System.out.println(reservations);
            for (Reservation reservation : reservations){
                Optional<Ride> ride = rideRepository.findById(reservation.getRide().getIdRide());
                if(ride.isPresent()) {
                    if(ride.get().getDriver() != null){
                        Optional<Review> review = reviewRepository.findReviewByReviewerAndRide(user.get() , ride.get());
                        if(review.isEmpty()) {
                            notReviewedRides.add(ride.get());
                        }
                    }
                }
            }
            for (Ride ride : rides){
                if(ride.getDriver() != null){
                    ResponseEntity<List<Reservation>> response = getNotReviewedPassengerByRide(ride.getIdRide());
                    if (response.getStatusCode() == HttpStatus.OK) {
                        List<Reservation> res = response.getBody();
                        if (res != null && !res.isEmpty() ){
                            int n = 0;
                            for(Reservation r: res){
                                if(r.getPassenger() == null){
                                    n++;
                                }
                            }
                            if(n != res.size()){
                                notReviewedRides.add(ride);
                            }
                        }
                    }
                }

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

























