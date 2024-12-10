import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ride } from '../../models/Ride';
import { RideService } from '../../services/ride.service';
import { User } from '../../models/User';
import { ReservationService } from '../../services/reservation.service';
import { Reservation } from '../../models/Reservation';
import { HttpParams } from '@angular/common/http';


@Component({
  selector: 'app-ride-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ride-list.component.html',
  styleUrl: './ride-list.component.css'
})
export class RideListComponent implements OnInit, OnChanges{
  user!: User
  rides: Ride[] = [];
  isLoading: boolean = true;
  isProcessing: boolean = false;
  errorMessage: string = '';
  successMessage: string | null = null;
  reservationStatus: Map<object | undefined, string | null> = new Map();
  @Input() ListRides : Ride[] = [];
  changes: number = 0;

  constructor(private rideService: RideService, private reservationService: ReservationService){}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ListRides'] && this.changes>0) {
      this.rides = this.ListRides.filter((ride: Ride) => ride.driver?.idUser !== this.user.idUser);
      console.log('Les données ont été mises à jour:', this.rides);
      if (this.ListRides.length === 0 && this.changes>0) {
        this.errorMessage = "no Ride found with this filter!";
      }
    }
  }
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
    if(this.ListRides.length === 0){
      this.getAllRide();
    }else{
      this.rides=this.ListRides
      this.loadReservationStatuses();
    }
  }

  getAllRide() {
    let params = new HttpParams();
    this.rideService.all(params).subscribe({
      next: (data: Ride[]) => {
        const now = Date.now();
        console.log(data);
        this.rides = data.filter((ride: Ride) => {
          console.log(ride)
          if (!ride || !ride.dateRide) return false;
          const rideDate = new Date(ride.dateRide).getTime(); 
          console.log(ride.idRide,ride.status)
          return rideDate > now  && ride.driver?.idUser !== this.user.idUser;
        });
        console.log(this.rides)
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
