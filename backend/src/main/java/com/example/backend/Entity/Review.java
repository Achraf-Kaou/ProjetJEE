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
    @JoinColumn(name = "idReviwer", nullable = true)
    private User reviewer;
    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    @JoinColumn(name = "idReviwed")
    private User reviewed;
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
