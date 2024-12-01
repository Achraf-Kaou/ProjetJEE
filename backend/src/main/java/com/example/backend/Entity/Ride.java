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
@Table(name = "Ride")
public class Ride {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long idRide;
    @Column
    private String depart;
    @Column
    private String destination;
    @Column
    private int places;
    @Column
    private double price;
    @Column
    private String description;
    @Column
    private Timestamp dateRide;
    @ManyToOne
    @JoinColumn(name = "idDriver", nullable = true)
    private User driver;
}
