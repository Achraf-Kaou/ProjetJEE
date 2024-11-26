package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.sql.Timestamp;

@Getter
@Setter
@ToString
@Entity
@Table(name = "Review")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long idReview;
    @ManyToOne
    @JoinColumn(name = "idReviwer")
    private User Reviewer;
    @ManyToOne
    @JoinColumn(name = "idReviwed")
    private User Reviewed;
    @ManyToOne
    @JoinColumn(name = "idRide")
    private Ride ride;
    @Column
    private int review;
    @Column
    private String comment;
    @Column
    private Timestamp dateReview;

}
