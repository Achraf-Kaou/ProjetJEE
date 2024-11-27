package com.example.backend.Controller;


import com.example.backend.Entity.Ride;
import com.example.backend.Repository.RideRepository;
import com.example.backend.Service.RideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class RideController {
    @Autowired
    private RideService rService;

    @PostMapping("/addRide/{idDriver}")
    public ResponseEntity<Ride> addRide(@RequestBody Ride ride, @PathVariable Long idDriver) {
        return rService.addRide(ride , idDriver);
    }

    @GetMapping("/getAllRides")
    public ResponseEntity<List<Ride>> getAllRides() {
        return rService.getAllRides();
    }
    @PutMapping("/updateRide")
    public ResponseEntity<Ride> updateRide(@RequestBody Ride ride) {
        return rService.updateRide(ride);
    }
    @DeleteMapping("/deleteRide/{idRide}")
    public ResponseEntity<String> deleteRide(@PathVariable Long idRide) {
        return rService.deleteRide(idRide);
    }
    @PutMapping("/updateRidePlaces/{idRide}")
    public ResponseEntity<Ride> updateRidePlaces(@PathVariable Long idRide,  @RequestParam int index ) {
        return rService.updateRidePlaces(idRide , index);
    }
    @GetMapping("/getAllRideByUser/{idUser}")
    public ResponseEntity<List<Ride>> getAllRideByUser(@PathVariable Long idUser) {
        return rService.getAllRideByUser(idUser);
    }

}
