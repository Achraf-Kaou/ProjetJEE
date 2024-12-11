import { Component, Input } from '@angular/core';
import { User } from '../../models/User';
import { CommonModule } from '@angular/common';
import { RideService } from '../../services/ride.service';
import { Ride } from '../../models/Ride';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { ReviewService } from '../../services/review.service';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { ViewReviewsComponent } from "../view-reviews/view-reviews.component";

@Component({
  selector: 'app-ride-list-no-details',
  standalone: true,
  imports: [CommonModule, NgbRatingModule, ViewReviewsComponent],
  templateUrl: './ride-list-no-details.component.html',
  styleUrl: './ride-list-no-details.component.css'
})

export class RideListNoDetailsComponent {
  @Input() user!: User;
  errorMessage: string = '';
  isLoading: boolean = true;
  rides: {ride: Ride; review: number}[] = [];
  isCommentModalOpen = false;
  selectedRide!: Ride ;

  constructor(private rideService: RideService, private reviewService: ReviewService){}
  ngOnInit() {
    this.getAllRidesByUser();
  }
  getAllRidesByUser() {
    // Start by fetching all rides
    this.rideService.getAllRideByUser(this.user.idUser).pipe(
      switchMap((rides: Ride[]) => {
        if(rides.length === 0){
          this.errorMessage = 'No rides found';
          this.isLoading = false;
          return [];
        }
        // For each ride, fetch its reviews using forkJoin
        const reviewRequests = rides.map(ride =>
          this.reviewService.getMeanReviewByRide(ride.idRide).pipe(
            // Add a default review value if there's an error fetching the review
            catchError(() => of(null))
          )
        );
        // Use forkJoin to wait for all reviews to be fetched
        return forkJoin(reviewRequests).pipe(
          map(reviews => {
            // Combine the rides and their reviews
            return rides.map((ride, index) => ({
              ride,
              review: reviews[index]
            }));
          })
        );
      })
    ).subscribe({
      next: (ridesWithReviews) => {
        console.log(ridesWithReviews);
        this.rides = ridesWithReviews; // Store the rides with their reviews
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to fetch rides';
        this.isLoading = false;
      }
    });
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
}
