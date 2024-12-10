package com.example.backend.Service;

import com.example.backend.Entity.Reservation;
import com.example.backend.Entity.Ride;
import com.example.backend.Entity.User;
import com.example.backend.Repository.ReservationRepository;
import com.example.backend.Repository.RideRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.text.SimpleDateFormat;



import java.util.List;

@Service
public class NotificationServiceImp implements NotificationService {
    @Autowired
    private EmailService emailService;
    @Autowired
    private ReservationRepository reservationRepository;
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
                        + "Please log in to your account to check the latest details.\n\n"
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
    public void notifyDriverAboutRidePlaces(Reservation res) {
            User driver = res.getRide().getDriver();
            Ride ride = res.getRide();
            User passenger = res.getPassenger();
            if (driver.getEmail() != null) {

                String subject = "Update on Your Ride Places";
                String message = "Dear " + driver.getFirstName() + " " + driver.getLastName() + ",\n\n"
                        + "A reservation has been made for your ride by " + passenger.getFirstName() + " " + passenger.getLastName() + ".\n"
                        + "Departure: " + ride.getDepart() + "\n"
                        + "Destination: " + ride.getDestination() + "\n"
                        + "Date: " + ride.getDateRide() + "\n"
                        + "You now have only "
                        + ride.getPlaces() + " available places left. Please log in to your account to check the latest details.\n\n"
                        + "Thank you!";
                emailService.sendEmail(driver.getEmail(), subject, message);
            }
    }
}
