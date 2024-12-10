package com.example.backend.Service;

import com.example.backend.Entity.Reservation;
import com.example.backend.Entity.Review;
import com.example.backend.Entity.Ride;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ReviewService {
    ResponseEntity<Review> addReview(Review review);
    ResponseEntity<Review> updateReview(Review review);
    ResponseEntity<Double> getMeanReviewByUser(Long idUser);
    ResponseEntity<Double> getMeanReviewByRide(Long idRide);
    ResponseEntity<String> deleteReview(Long idReview);
    ResponseEntity<List<Review>> getAllReviewByRide(Long idRide);
    ResponseEntity<List<Ride>> getNotReviewedRides(Long idUser);
    ResponseEntity<List<Reservation>> getNotReviewedPassengerByRide(Long idRide);
    ResponseEntity<Review> getReviewByReviewedAndRide(Long idReviewed, Long ride);
}
