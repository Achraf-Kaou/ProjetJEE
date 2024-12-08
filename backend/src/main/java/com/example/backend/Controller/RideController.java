package com.example.backend.Controller;
import com.example.backend.Entity.Review;
import com.example.backend.Entity.Ride;
import com.example.backend.Service.RideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;

@RequestMapping("/ride")
@RestController
public class RideController {
    @Autowired
    private RideService rService;

    @PostMapping("/addRide")
    public ResponseEntity<Ride> addRide(@RequestBody Ride ride) {
        return rService.addRide(ride);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Ride>> getFilteredRides(
            @RequestParam(required = false) String depart,
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) Double price,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) String dateRide
    ) {
        System.out.println("depart="+depart);
        System.out.println("destination="+destination);
        System.out.println("price="+price);
        System.out.println("dateRide="+dateRide);
        Timestamp dateRideTimestamp = (dateRide != null) ? Timestamp.valueOf(dateRide) : null;
        if (depart == null && destination == null && price == null && dateRideTimestamp == null) {
            return rService.getAllRides();
        }
        return rService.getFilteredRides(depart, destination, price, dateRideTimestamp); }

    @GetMapping("/getAllRides")
    public ResponseEntity<List<Ride>> getAllRides() { return rService.getAllRides(); }

    @PutMapping("/updateRide")
    public ResponseEntity<Ride> updateRide(@RequestBody Ride ride ) { return rService.updateRide(ride); }

    @DeleteMapping("/deleteRide/{idRide}")
    public ResponseEntity<String> deleteRide(@PathVariable Long idRide) { return rService.deleteRide(idRide); }

    @PutMapping("/updateRidePlaces/{idRide}")
    public ResponseEntity<Ride> updateRidePlaces(@PathVariable Long idRide,  @RequestParam int index ) {
        return rService.updateRidePlaces(idRide , index);
    }

    @GetMapping("/getAllRideByUser/{idUser}")
    public ResponseEntity<List<Ride>> getAllRideByUser(@PathVariable Long idUser) {
        return rService.getAllRideByUser(idUser);
    }

    @GetMapping("/terminateRides")
    public  ResponseEntity<?> terminateRides() {
        return rService.terminateRides();
    }

}
