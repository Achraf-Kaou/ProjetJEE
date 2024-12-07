package com.example.backend.Controller;


import com.example.backend.Entity.Reservation;
import com.example.backend.Entity.Review;
import com.example.backend.Entity.Ride;
import com.example.backend.Service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/review")
@RestController
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @PostMapping("/addReview")
    public ResponseEntity<Review> addReview(@RequestBody Review review) {
        return reviewService.addReview(review);
    }

    @PutMapping("/updateReview")
    public ResponseEntity<Review> updateReview(@RequestBody Review review) {
        return reviewService.updateReview(review);
    }

    @GetMapping("/getMeanReviewByUser/{idUser}")
    public ResponseEntity<Double> getMeanReviewByUser(@PathVariable Long idUser) {
        return reviewService.getMeanReviewByUser(idUser);
    }
    @GetMapping("/getMeanReviewByRide/{idRide}")
    public ResponseEntity<Double> getMeanReviewByRide(@PathVariable Long idRide) {
        return reviewService.getMeanReviewByRide(idRide);
    }

    @DeleteMapping("/deleteReview/{idReview}")
    public ResponseEntity<String> deleteReview(@PathVariable Long idReview) {
        return reviewService.deleteReview(idReview);
    }

    @GetMapping("/getAllReviewByRide/{idRide}")
    public ResponseEntity<List<Review>> getAllReviewByRide(@PathVariable Long idRide) {
        return reviewService.getAllReviewByRide(idRide);
    }
    @GetMapping("/getNotReviewedPassengerByRide/{idRide}")
    public ResponseEntity<List<Reservation>> getNotReviewedPassengerByRide(@PathVariable Long idRide) {
        return reviewService.getNotReviewedPassengerByRide(idRide);
    }
    @GetMapping("/getNotReviewedRides/{idUser}")
    public ResponseEntity<List<Ride>> getNotReviewedRides(@PathVariable Long idUser) {
        return reviewService.getNotReviewedRides(idUser);
    }

}
