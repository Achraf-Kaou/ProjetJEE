package com.example.backend.Service;

import com.example.backend.Entity.Ride;

public interface NotificationService {
    public void notifyPassengersAboutRideUpdate(Ride ride);
    public void notifyPassengersAboutRideDelete(Long idRide);
    public void notifyDriverAboutRidePlaces(Ride ride);
}
