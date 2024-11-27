package com.example.backend.Repository;

import com.example.backend.Entity.Review;
import com.example.backend.Entity.Ride;
import com.example.backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review,Long>{
    List<Review> findReviewByReviewed(User reviewed);
    List<Review> findReviewByRide(Ride ride);
}
