package com.example.backend.Repository;

import com.example.backend.Entity.Review;
import com.example.backend.Entity.Ride;
import com.example.backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review,Long>{
    List<Review> findReviewByReviewed(User reviewed);
    List<Review> findReviewByRide(Ride ride);
    List<Review> findReviewByReviewer(User reviewer);
    Optional<Review> findReviewByReviewerAndRide(User user , Ride ride);
    Optional<Review> findReviewByReviewerAndReviewedAndRide(User reviewer ,User reviewed, Ride ride);

    Optional<Review> findReviewByReviewedAndRide(User reviewed, Ride ride);

    List<Review> findByRide(Ride ride);
}
