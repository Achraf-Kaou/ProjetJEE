import { Component, OnInit } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap'
import { Ride } from '../../models/Ride';
import { ReservationService } from '../../services/reservation.service';
import { RideService } from '../../services/ride.service';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Reservation } from '../../models/Reservation';
import { User } from '../../models/User';

@Component({
  selector: 'app-ride-history',
  standalone: true,
  imports: [NgbAccordionModule, CommonModule ],
  templateUrl: './ride-history.component.html',
  styleUrl: './ride-history.component.css'
})
export class RideHistoryComponent implements OnInit {
  rides: {ride: Ride; reservations: Reservation[]}[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  user!: User;

  constructor(private rideService: RideService, private reservationService: ReservationService) {}

  ngOnInit(): void {
    const userFromLocalStorage = localStorage.getItem('user');
    if (userFromLocalStorage) {
      this.user = JSON.parse(userFromLocalStorage);
    }
    this.getRidesWithReservations().subscribe(
      data => {
        this.rides = data;
        this.isLoading = false;
        this.errorMessage = 'Failed to load rides. Please try again later.';
      },
      error => {
        console.error('Error fetching rides with reservations:', error);
        this.isLoading = false; // Désactiver le chargement même en cas d'erreur
      }
    );
  }

  getRidesWithReservations(): Observable<any[]> {
    return this.rideService.getAllRideByUser(this.user.idUser).pipe(
      switchMap((rides: any[]) => {
        const requests = rides.map(ride =>
          this.reservationService.getAllReservationByRide(ride.idRide).pipe(
            map(reservations => ({
              ride,
              reservations, // Combine the ride with its reservations
            }))
          ),
        );
        return forkJoin(requests);
      })
    );
  }

  getRides(){
    console.log(this.rides)
  }
}

