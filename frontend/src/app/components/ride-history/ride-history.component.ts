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
import { UpdateRideComponent } from "../update-ride/update-ride.component";
import { Router } from '@angular/router';
import { ViewReviewsComponent } from "../view-reviews/view-reviews.component";
import { ReviewUpdateComponent } from "../review-update/review-update.component";

@Component({
  selector: 'app-ride-history',
  standalone: true,
  imports: [NgbAccordionModule, CommonModule, NgbRatingModule, UpdateRideComponent, ViewReviewsComponent, ReviewUpdateComponent],
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
  isEditModalOpen = false;
  isCommentModalOpen = false;
  selectedRide!: Ride ;
  isRides: boolean = false;
  isReviewModalOpen: boolean = false;
  selectedReview:Review= {
    idReview: 0,
    reviewer: null,
    reviewed: null,
    ride: null,
    review: 0,
    comment: "",
    dateReview: new Date()  // Ajoute la date actuelle ici
  };

  constructor(private rideService: RideService, private reservationService: ReservationService, private reviewService : ReviewService, private router: Router) {}

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
        this.rides = data.sort((a, b) => {
          const dateA = new Date(a.ride.dateRide).getTime() ; // Convert to Date object
          const dateB = new Date(b.ride.dateRide).getTime() ; // Convert to Date object
          return dateB - dateA; // Sort in ascending order
        });
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
      idReview: 0,
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
        this.selectedRide = rides[0];
        if (rides.length === 0) {
          console.log('No rides found.');
          this.errorMessage = 'No rides found for this user.';
          this.isLoading = false;
          return of([]); // Return an empty array as observable
        }
        this.isRides = true
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
                  this.reviewService.getReviewByReviewedAndRide(reservation.passenger?.idUser, ride.idRide).pipe(
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
      this.rideService.deleteRide(this.selectedRide.idRide).subscribe(
        (response) => {
          this.closeDeleteModal();
          localStorage.setItem('successMessage', 'ride deleted successfully!');
          this.isProcessing = false;
          this.router.navigateByUrl(`/profil/${this.user.idUser}`);
        },
        (error) => {
          console.error('Failed to delete ride:', error);
          if (error.status === 401){
            this.errorMessage = "can not delete a passed ride";
          }
          if (error.status === 404){
            this.errorMessage = "ride not found";
          }
          if (error.status === 200){
            localStorage.setItem('successMessage', 'ride deleted successfully!');
            window.location.reload();
          }
          this.isProcessing = false;
          this.closeDeleteModal();
        }
      );}
  }
  // Opens the delete modal
  openDeleteModal(ride: Ride): void {
    this.selectedRide = ride; // Set the ride to be deleted
    this.isDeleteModalOpen = true; // Open the modal
  }

  closeDeleteModal(): void {
    const defaultRide: Ride = {
      idRide: 0,
      depart: "",
      destination: "",
      places: 0,
      price: 0,
      dateRide: new Date(),
      description: "",
      driver: null,
      status:""
    };
    this.isDeleteModalOpen = false;
    this.selectedRide = defaultRide; // Clear the selected ride
  }
  openEditModal(ride: Ride): void {
    this.selectedRide = ride; // Set the ride to be deleted
    this.isEditModalOpen = true; // Open the modal
  }

  closeEditModal(): void {
    const defaultRide: Ride = {
      idRide: 0,
      depart: "",
      destination: "",
      places: 0,
      price: 0,
      dateRide: new Date(),
      description: "",
      driver: null,
      status:""
    };
    this.isEditModalOpen = false;
    this.selectedRide = defaultRide; // Clear the selected ride
  }

  openCommentModal(ride: Ride): void {
    this.selectedRide = ride; // Set the ride to be deleted
    this.isCommentModalOpen = true; // Open the modal
  }

  closeCommentModal(): void {
    const defaultRide: Ride = {
      idRide: 0,
      depart: "",
      destination: "",
      places: 0,
      price: 0,
      dateRide: new Date(),
      description: "",
      driver: null,
      status:""
    };
    this.isCommentModalOpen = false;
    this.selectedRide = defaultRide; // Clear the selected ride
  }
  openReviewModal(review: Review): void {
    this.selectedReview = review; // Set the ride to be deleted
    this.isReviewModalOpen = true; // Open the modal
    console.log(this.selectedReview); //
  }

  closeReviewModal(): void {
    const defaultReview: Review = {
      idReview: 0,
      reviewer: null,
      reviewed: null,
      ride: null,
      review: 0,
      comment: "",
      dateReview: new Date()  // Ajoute la date actuelle ici
    };
    this.isReviewModalOpen = false;
    this.selectedReview = defaultReview; // Clear the selected ride
  }
}

