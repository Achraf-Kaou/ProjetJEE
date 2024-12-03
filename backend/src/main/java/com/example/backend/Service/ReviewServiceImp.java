package com.example.backend.Service;

import com.example.backend.Entity.Review;
import com.example.backend.Entity.Ride;
import com.example.backend.Entity.User;
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

    @Override
    public ResponseEntity<Review> addReview(Review review) {
        return ResponseEntity.status(HttpStatus.OK).body(reviewRepository.save(review));
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


}

























