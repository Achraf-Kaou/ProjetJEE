import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ride } from '../../models/Ride';
import { RideService } from '../../services/ride.service';
import { User } from '../../models/User';
import { ReservationService } from '../../services/reservation.service';
import { Reservation } from '../../models/Reservation';



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
  reservationStatus: Map<object | undefined, boolean> = new Map();
  @Input() ListRides !: Ride[]

  constructor(private rideService: RideService, private reservationService: ReservationService){}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ListRides']) {
      this.rides=this.ListRides
      console.log('Les données ont été mises à jour:', this.rides);
    }
  }
  ngOnInit() {
    console.log("list fel rideLIts",this.ListRides);
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
    this.rideService.getAllRide().subscribe({
      next: (data) => {
        this.rides = data;
        this.isLoading = false;
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
    this.reservationService.addReservation(this.user.idUser,ride.idRide)
    .subscribe(
      (response: any) => {
        window.location.reload();
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

  cancelReservation(ride: Ride) {
    let reservation!: Reservation ;
    this.reservationService.getReservationByPassangerAndRide(this.user.idUser, ride.idRide)
      .subscribe(
        (response: Reservation) => {
          console.log(response);
          this.reservationService.cancelReservation(response.idReservation)
            .subscribe(
              res => {
                window.location.reload();
              },
              error => {
                console.error(error);
              }
            )
          },
          error => console.log(error),
        )
  }

  loadReservationStatuses() {
    this.rides.forEach((ride) => {
      this.reservationService
        .getReservationByPassangerAndRide(this.user.idUser, ride.idRide)
        .subscribe({
          next: (reservation) => {
            this.reservationStatus.set(ride.idRide, reservation !== null);
          },
          error: () => {
            this.reservationStatus.set(ride.idRide, false);
          },
        });
    });
  }

  hasReservation(ride: Ride): boolean {
    return this.reservationStatus.get(ride.idRide) || false;
  }

  checkReservationByUserByPassangerAndRide(ride: Ride): boolean | undefined {
    this.reservationService.getReservationByPassangerAndRide(this.user.idUser, ride.idRide).subscribe({
      next: (reservation) => {
        console.log(reservation);
        if (reservation !== null) {
          return false;
        } else {
          return true;
        }
      },
    });
    return undefined;
  }
}
