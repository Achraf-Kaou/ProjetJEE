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
@Table(name = "Reservation")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long idReservation;
    @ManyToOne
    @JoinColumn(name = "idRide", nullable = true)
    private Ride ride;
    @ManyToOne
    @JoinColumn(name = "idPassenger", nullable = true)
    private User passenger;
    @Column
    private Timestamp dateReservation;
    @Column
    private String status;
}

