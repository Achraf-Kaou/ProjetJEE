import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ride } from '../../models/Ride';
import { RideService } from '../../services/ride.service';
import { User } from '../../models/User';
import { ReservationService } from '../../services/reservation.service';
import { Reservation } from '../../models/Reservation';
import { HttpParams } from '@angular/common/http';
import { Review } from '../../models/Review';
import { forkJoin } from 'rxjs';
import { ReviewService } from '../../services/review.service';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-ride-list',
  standalone: true,
  imports: [CommonModule,NgbRatingModule],
  templateUrl: './ride-list.component.html',
  styleUrl: './ride-list.component.css'
})
export class RideListComponent implements OnInit, OnChanges{
  user!: User
  rides: {
    ride : Ride;
    review: number;
  }[] = [];
  isLoading: boolean = true;
  isProcessing: boolean = false;
  errorMessage: string = '';
  successMessage: string | null = null;
  reservationStatus: Map<object | undefined, string | null> = new Map();
  @Input() ListRides : Ride[] = [];
  changes: number = 0;

  constructor(private rideService: RideService, private reservationService: ReservationService, private reviewService: ReviewService){}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ListRides'] && this.changes>0) {
      const filteredRides: Ride[] = this.ListRides.filter((ride: Ride) => ride.driver?.idUser !== this.user.idUser);

    if (filteredRides.length === 0) {
      this.errorMessage = "No ride found with this filter!";
      this.rides = []; // Clear the rides array if no rides match the filter
      return;
    }

    // Map the filtered rides to the new rides structure
    const rideObservables = filteredRides.map((ride) =>
      this.reviewService.getMeanReviewByRide(ride.idRide) // Assume this method fetches the average review as a number
    );

    forkJoin(rideObservables).subscribe({
      next: (reviews: number[]) => {
        this.rides = filteredRides.map((ride, index) => ({
          ride,
          review: reviews[index] || 0, // Use the fetched review or default to 0
        }));
      },
      error: (error) => {
        console.error('Error fetching reviews:', error);
        this.errorMessage = 'Failed to load ride reviews. Please try again.';
        this.rides = [];
      },
    });
        this.errorMessage = "no Ride found with this filter!";
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
      // Transform ListRides to match the rides structure
    const filteredRides: Ride[] = this.ListRides.filter(
      (ride: Ride) => ride.driver?.idUser !== this.user.idUser
    );

    const rideObservables = filteredRides.map((ride) =>
      this.reviewService.getMeanReviewByRide(ride.idRide) // Fetch the mean review for each ride
    );

    forkJoin(rideObservables).subscribe({
      next: (reviews: number[]) => {
        this.rides = filteredRides.map((ride, index) => ({
          ride,
          review: reviews[index] || 0, // Default to 0 if no review is found
        }));
        this.loadReservationStatuses(); // Load reservation statuses after rides are ready
      },
      error: (error) => {
        console.error('Error fetching reviews:', error);
        this.errorMessage = 'Failed to load ride reviews. Please try again.';
      },
    });
    }
  }

  getAllRide() {
    let params = new HttpParams();
  
    this.rideService.all(params).subscribe({
      next: (data: Ride[]) => {
        const now = Date.now();
        const filteredRides = data
          .filter((ride: Ride) => {
            if (!ride || !ride.dateRide) return false;
            const rideDate = new Date(ride.dateRide).getTime();
            return rideDate > now && ride.driver?.idUser !== this.user.idUser;
          })
          .sort((a, b) => {
            const dateA = new Date(a.dateRide).getTime();
            const dateB = new Date(b.dateRide).getTime();
            return dateA - dateB; // Sort in ascending order
          });
  
        if (filteredRides.length === 0) {
          this.errorMessage = 'No rides found';
          this.isLoading = false;
          return;
        }
  
        // Use forkJoin to fetch reviews for each filtered ride
        const reviewObservables = filteredRides.map((ride) =>
          this.reviewService.getMeanReviewByUser(ride.driver?.idUser) // Assume this method returns reviews for a ride
        );
  
        forkJoin(reviewObservables).subscribe({
          next: (reviews: number[]) => {
            this.rides = filteredRides.map((ride, index) => ({
              ride,
              review: reviews[index] || 0, // Use the last review or null if none
            }));
  
            this.loadReservationStatuses();
          },
          error: (error) => {
            console.error('Error fetching reviews:', error);
            this.errorMessage = 'Failed to load reviews. Please try again later.';
            this.isLoading = false;
          },
        });
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
      this.reservationService.getReservationByPassangerAndRide(this.user.idUser, ride.ride.idRide)
        .subscribe({
          next: (reservation) => {
            this.reservationStatus.set(ride.ride.idRide, reservation[reservation.length - 1] ? reservation[reservation.length - 1].status : null);
            this.isLoading = false;
          },
          error: () => {
            this.reservationStatus.set(ride.ride.idRide, null);
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
