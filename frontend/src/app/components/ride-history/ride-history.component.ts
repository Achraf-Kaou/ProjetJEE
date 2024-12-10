import { Component, OnInit } from '@angular/core';
import { NgbAccordionModule, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap'
import { Ride } from '../../models/Ride';
import { ReservationService } from '../../services/reservation.service';
import { RideService } from '../../services/ride.service';
import { catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Reservation } from '../../models/Reservation';
import { User } from '../../models/User';

import { ReviewService } from '../../services/review.service';
import { Review } from '../../models/Review';

@Component({
  selector: 'app-ride-history',
  standalone: true,
  imports: [NgbAccordionModule, CommonModule, NgbRatingModule],
  templateUrl: './ride-history.component.html',
  styleUrl: './ride-history.component.css'
})
export class RideHistoryComponent implements OnInit {
  rides: {
    ride: Ride;
    review: number;
    reservations: {
      reservation: Reservation;
      review: Review;
    }[];
  }[] = [];
  isLoading: boolean = true;
  isProcessing: boolean = false;
  errorMessage: string = '';
  successMessage: string | null = null;
  /* @Input()  */ user!: User;
  isDeleteModalOpen = false;
  selectedRide: Ride | null = null;

  constructor(private rideService: RideService, private reservationService: ReservationService, private reviewService : ReviewService) {}

  ngOnInit(): void {
    const message = localStorage.getItem('successMessage');
    if (message) {
      this.successMessage = message;
      localStorage.removeItem('successMessage');
    }
    const userFromLocalStorage = localStorage.getItem('user');
    if (userFromLocalStorage) {
      this.user = JSON.parse(userFromLocalStorage);
    }
    this.getRidesWithReservations().subscribe({
      next: (data) => {
        console.log("test 12 12 ")
        console.log(data);
        this.rides = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching rides with reservations:', error);
        this.errorMessage = 'Failed to load rides. Please try again later.';
        this.isLoading = false;
      }
    });  
  }
  getRidesWithReservations() {
    const defaultReview: Review = {
      id: 0,
      ride: {} as Ride, // Provide an empty object cast as `Ride`
      reviewer: null,
      reviewed: null,
      dateReview: null,
      review: 0,
      comment: ""
    };
    return this.rideService.getAllRideByUser (this.user.idUser ).pipe(
      switchMap((rides: Ride[]) => {
        console.log('Fetched Rides:', rides); // Debugging: Check fetched rides
  
        if (rides.length === 0) {
          console.log('No rides found.');
          this.errorMessage = 'No rides found for this user.';
          this.isLoading = false;
          return of([]); // Return an empty array as observable
        }
  
        const rideRequests = rides.map((ride) =>
          forkJoin({
            // Fetch reservations for the ride
            reservations: this.reservationService.getAllReservationByRide(ride.idRide).pipe(
              tap((reservations) => console.log(`Reservations for Ride ${ride.idRide}:`, reservations)),
              switchMap((reservations: Reservation[]) => {
                if (reservations.length === 0) {
                  return of([]); // Return empty array if no reservations
                }
  
                const reservationReviewsRequests = reservations.map((reservation) =>
                  this.reviewService.getReviewByReviewedAndRide(reservation.passenger.idUser, ride.idRide).pipe(
                    map((review) => ({
                      reservation,
                      review, // Add the review for the passenger
                    })),
                    catchError((err) => {
                      console.error('Error fetching passenger review:', err);
                      return of({ reservation, review : defaultReview }); // Return null review on error
                    }) // Handle errors for missing reviews
                  )
                );
                return forkJoin(reservationReviewsRequests);
              }),
              catchError((err) => {
                console.error('Error fetching reservations:', err);
                return of([]); // Handle errors for reservations
              })
            ),
            // Fetch review for the ride
            rideReview: this.reviewService.getMeanReviewByRide(ride.idRide).pipe(
              tap((review) => console.log(`Review for Ride ${ride.idRide}:`, review)),
              catchError((err) => {
                console.error('Error fetching ride review:', err);
                return of(null); // Handle errors for missing ride reviews
              })
            ),
          }).pipe(
            map(({ reservations, rideReview }) => ({
              ride,
              review: rideReview, // Add the review for the ride
              reservations, // Include reservations with their passenger reviews
            }))
          )
        );
  
        return forkJoin(rideRequests); // Wait for all rides to complete
      }),
      catchError((err) => {
        console.error('Error in getRidesWithReservations:', err);
        this.errorMessage = 'An error occurred while fetching data.';
        this.isLoading = false;
        return of([]); // Return an empty array in case of errors
      })
    );
  }

  

  deleteRide(): void {
    this.isProcessing = true;
    if (this.selectedRide) {
      this.rideService.deleteRide(this.selectedRide.idRide).subscribe({
        next: (response) => {
          this.closeDeleteModal();
          localStorage.setItem('successMessage', 'Reservation added successfully!');
          this.isProcessing = false;
          window.location.reload();
        },
        error :(error) => {
          console.error('Failed to delete ride:', error);
          if (error.status === 401){
            this.errorMessage = "can not delete a passed ride";
          }
          if (error.status === 404){
            this.errorMessage = "ride not found";
          }
          this.isProcessing = false;
          this.closeDeleteModal();
        }
      });}
  }
  // Opens the delete modal
  openDeleteModal(ride: Ride): void {
    this.selectedRide = ride; // Set the ride to be deleted
    this.isDeleteModalOpen = true; // Open the modal
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.selectedRide = null; // Clear the selected ride
  }
}

