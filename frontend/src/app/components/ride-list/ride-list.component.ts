import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Ride } from '../../models/Ride';
import { RideService } from '../../services/ride.service';
import { User } from '../../models/User';
import { ReservationService } from '../../services/reservation.service';
import { Reservation } from '../../models/Reservation';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-ride-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ride-list.component.html',
  styleUrl: './ride-list.component.css'
})
export class RideListComponent implements OnInit{
  /* @Input()  */user!: User
  rides: Ride[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  hasReservation$!: Observable<boolean>;


  constructor(private rideService: RideService, private reservationService: ReservationService){}

  ngOnInit() {
    const userFromLocalStorage = localStorage.getItem('user');
    if (userFromLocalStorage) {
      this.user = JSON.parse(userFromLocalStorage);
    }
    this.getAllRide();
  }

  getAllRide() {
    this.rideService.getAllRide().subscribe({
      next: (data) => {
        this.rides = data;
        this.isLoading = false;
        console.log(data);
        this.hasReservation$ = this.checkReservationByUser(data);
      },
      error: (error) => {
        console.error('Error fetching rides:', error);
        this.errorMessage = 'Failed to load rides. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  addReservation(ride: Ride) {
    const currentDate: Date = new Date();
    console.log(currentDate);
    const reservation: Reservation = {
      ride: ride,
      passenger: this.user,
      dateReservation: currentDate,
      status: 1
    }
    this.reservationService.addReservation(reservation)
    .subscribe(
      (response: any) => {
        window.location.reload();
      },
      (err: any) => {
        console.error(err);
      }
    );
  }
  checkReservationByUser(ride: Ride): Observable<boolean> {
    console.log(this.user)
    return this.reservationService.getAllReservationByUser(this.user.id).pipe(
      map((userReservations: any[]) => {
        return userReservations.some(
          (reservation) => reservation.ride.id === ride.id
        );
      }),
      catchError((error) => {
        console.error('Error checking reservation:', error);
        return of(false); // Default to false if there's an error
      })
    );
  }
  
}
