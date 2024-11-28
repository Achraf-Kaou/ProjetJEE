package com.example.backend.Service;

import com.example.backend.Entity.Reservation;
import com.example.backend.Entity.Ride;
import com.example.backend.Entity.User;
import com.example.backend.Repository.ReservationRepository;
import com.example.backend.Repository.RideRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReservationHelperServiceImp implements ReservationHelperService {
    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private RideRepository rideRepository;

    @Override
    public void notifyPassengersAboutRideUpdate(Ride ride) {
        List<Reservation> reservations = reservationRepository.findReservationsByRideAndStatus(ride, "En-cours");
        for (Reservation reservation : reservations) {
            User passenger = reservation.getPassenger();
            System.out.println(passenger);
            if (passenger != null && passenger.getEmail() != null) {
                String subject = "Update on Your Ride Reservation";
                String message = "Dear " + passenger.getFirstName() + " " + passenger.getLastName()+ ",\n\n"
                        + "The ride you reserved has been updated to " + ride.getDateRide() + ", "
                        + ride.getDepart() + ", " + ride.getDestination() + ", " + ride.getPrice()
                        +". Please log in to your account to check the latest details.\n\n"
                        + "Thank you!";
                emailService.sendEmail(passenger.getEmail(), subject, message);
            }
        }
    }

    @Override
    public void notifyPassengersAboutRideDelete(Long idRide) {
        Ride ride = rideRepository.findById(idRide).orElse(null);
        List<Reservation> reservations = reservationRepository.findReservationsByRideAndStatus(ride, "En-cours");
        for (Reservation reservation : reservations) {
            User passenger = reservation.getPassenger();
            System.out.println(passenger);
            if (passenger != null && passenger.getEmail() != null) {
                String subject = "Delete Your Ride Reservation";
                String message = "Dear " + passenger.getFirstName() + " " + passenger.getLastName()+ ",\n\n"
                        + "The ride you reserved has been deleted by " + ride.getDriver().getFirstName() + " " + ride.getDriver().getLastName()
                        +". Please log in to your account to check the latest details.\n\n"
                        + "Thank you!";
                emailService.sendEmail(passenger.getEmail(), subject, message);
            }
        }
    }

    @Override
    public void notifyDriverAboutRidePlaces(Ride ride) {
            User driver = ride.getDriver();
            if (driver.getEmail() != null) {
                String subject = "Update on Your Ride Places";
                String message = "Dear " + driver.getFirstName() + " " + driver.getLastName()+ ",\n\n"
                        + "The places of your ride has been updated to " + ride.getPlaces()
                        +". Please log in to your account to check the latest details.\n\n"
                        + "Thank you!";
                emailService.sendEmail(driver.getEmail(), subject, message);
            }
    }
}
