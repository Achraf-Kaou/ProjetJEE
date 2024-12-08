import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ride } from '../../models/Ride';
import { RideService } from '../../services/ride.service';
import { User } from '../../models/User';
import { ReservationService } from '../../services/reservation.service';
import { Reservation } from '../../models/Reservation';
import { error } from 'node:console';
import { dateTimestampProvider } from 'rxjs/internal/scheduler/dateTimestampProvider';


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
  isProcessing: boolean = false;
  errorMessage: string = '';
  successMessage: string | null = null;
  reservationStatus: Map<object | undefined, string | null> = new Map();

  constructor(private rideService: RideService, private reservationService: ReservationService){}

  ngOnInit() {
    const message = localStorage.getItem('successMessage');
    if (message) {
      this.successMessage = message;
      localStorage.removeItem('successMessage');
    }
    const userFromLocalStorage = localStorage.getItem('user');
    if (userFromLocalStorage) {
      this.user = JSON.parse(userFromLocalStorage);
    }
    this.getAllRide();
  }

  getAllRide() {
    this.rideService.getAllRide().subscribe({
      next: (data: Ride[]) => {
        const now = Date.now();
        this.rides = data.filter((ride: Ride) => {
          const rideDate = new Date(ride.dateRide).getTime(); 
          return rideDate > now;
        });
        this.loadReservationStatuses();
      },
      error: (error) => {
        console.error('Error fetching rides:', error);
        this.errorMessage = 'Failed to load rides. Please try again later.';
        this.isLoading = false;
      },
    });
  }
  

  addReservation(ride: Ride) {
    this.isProcessing = true;
    this.reservationService.addReservation(this.user.idUser,ride.idRide)
    .subscribe({
      next : () => {
        localStorage.setItem('successMessage', 'Reservation added successfully!');
        this.isProcessing = false;
        window.location.reload();
      },
      error:(err: any) => {
        console.error(err);
        this.isProcessing = false;
        this.errorMessage = 'Failed to add the reservation';
      }
    });
  }

  cancelReservation(ride: Ride) {
    this.isProcessing = true;
    let reservation!: Reservation ;
    this.reservationService.getReservationByPassangerAndRide(this.user.idUser, ride.idRide)
      .subscribe({
        next:(response: Reservation[]) => {
          this.reservationService.cancelReservation(response[response.length - 1].idReservation)
            .subscribe({
              next :(res) => {
                localStorage.setItem('successMessage', 'Reservation canceled successfully!');
                this.isProcessing = false;
                window.location.reload();
              },
              error: (err) => {
                console.error(err)
                this.isProcessing = false;
                this.errorMessage = 'Failed to cancel the reservation. Please try again.';
              }
            });
          },
        error:() => {
          this.isProcessing = false;
          this.errorMessage = 'Failed to get reservation by your id and this ride. Please try again.';
        },
      })
  }

  loadReservationStatuses() {
    this.rides.forEach((ride) => {
      this.reservationService.getReservationByPassangerAndRide(this.user.idUser, ride.idRide)
        .subscribe({
          next: (reservation) => {
            this.reservationStatus.set(ride.idRide, reservation[reservation.length - 1] ? reservation[reservation.length - 1].status : null);
            this.isLoading = false;
          },
          error: () => {
            this.reservationStatus.set(ride.idRide, null);
            this.isLoading = false;
            this.errorMessage = 'Failed to check the status of the ride and reservation. Please try again.';

          },
        });
    });
  }

  hasReservation(ride: Ride): string | null {
    return this.reservationStatus.get(ride.idRide) || null;
  }
}
