import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Reservation } from '../../models/Reservation';
import { User } from '../../models/User';
import { ReservationService } from '../../services/reservation.service';
import { Review } from '../../models/Review';
import { catchError, of, map, forkJoin } from 'rxjs';
import { ReviewService } from '../../services/review.service';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { ReviewUpdateComponent } from "../review-update/review-update.component";
import { Ride } from '../../models/Ride';
import { ReviewComponent } from "../review/review.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reservation-history',
  standalone: true,
  imports: [CommonModule, NgbRatingModule, ReviewUpdateComponent, FormsModule],
  templateUrl: './reservation-history.component.html',
  styleUrl: './reservation-history.component.css'
})
export class ReservationHistoryComponent {
  reservations: {reservation: Reservation; review: Review}[] = [];
  /* @Input()  */user!: User;
  isLoading: boolean = true;
  isProcessing: boolean = false;
  errorMessage: string = '';
  successMessage: string | null = null;
  isReviewModalOpen: boolean = false;
  selectedReview: Review | undefined; 
  selectedRide!: Ride ;    

  rating : number = 0;
  review! : Review ;
  reviewText: string = '';
  stars: boolean[] = [false, false, false, false, false];  
  defaultReview: Review = {
    idReview: 0,
    reviewer: null,
    reviewed: null,
    ride: null,
    review: 0,
    comment: "",
    dateReview: null  // Ajoute la date actuelle ici
  };

  constructor(private reservationService: ReservationService, private reviewService: ReviewService){}
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
    this.getAllReservationsByUser(this.user);
  }

  getAllReservationsByUser(user: User) {
    const defaultReview: Review = {
      idReview: 0,
      reviewer: null,
      reviewed: null,
      ride: null,
      review: 0,
      comment: "",
      dateReview: null  // Ajoute la date actuelle ici
    };
    this.isLoading = true;
    this.reservationService.getAllReservationByUser(user.idUser).subscribe({
      next: (reservations: Reservation[]) => {
        if (reservations.length === 0) {
          this.reservations = [];
          this.isLoading = false;
          return;
        }
  
        // Use forkJoin to fetch reviews for each reservation
        const reservationWithReviews$ = reservations.map((reservation) => 
          
          this.reviewService.getReviewByReviewedAndRide(user.idUser, reservation.ride?.idRide).pipe(
            catchError(() => 
              // Return a default review in case of error
              of(defaultReview)
            ),
            map((review) => ({ reservation, review }))
          )
        );
  
        forkJoin(reservationWithReviews$).subscribe({
          next: (results) => {
            console.log(results);
            this.reservations = results.sort((a, b) => {
              const dateA = new Date(a.reservation.ride?.dateRide).getTime() ; // Convert to Date object
              const dateB = new Date(b.reservation.ride?.dateRide).getTime() ; // Convert to Date object
              return dateB - dateA; // Sort in ascending order
            });;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error fetching reviews:', error);
            this.errorMessage = 'Failed to load reviews for reservations.';
            this.isLoading = false;
          },
        });
      },
      error: (error) => {
        console.error('Error fetching reservations:', error);
        this.errorMessage = 'Failed to load reservations. Please try again later.';
        this.isLoading = false;
      },
    });
  }
  
  cancelReservation(reservation: Reservation) {
    this.isProcessing = true;
    this.reservationService.cancelReservation(reservation.idReservation)
      .subscribe({
        next : () => {
          localStorage.setItem('successMessage', 'Reservation canceled successfully!');
          this.isProcessing = false;
          window.location.reload();
        },
        error:() => {
          this.isProcessing = false;
          this.errorMessage = 'Failed to cancel the reservation. Please try again.';
        }
      }
    );
  }

  openReviewModal(review: Review , ride: Ride): void {
    const defaultReview: Review = {
      idReview: 0,
      reviewer: null,
      reviewed: null,
      ride: null,
      review: 0,
      comment: "",
      dateReview: null  // Ajoute la date actuelle ici
    };
    let review0: Review = defaultReview;
    this.reviewService.getReviewByReviewedAndRide(ride.driver?.idUser, ride.idRide).subscribe({
      next: (review: Review) => {
        console.log(review);
        console.log("reviewed",review.reviewed);
        console.log("reviewer",review.reviewer);
        this.selectedReview = review; 
        this.isReviewModalOpen = true;
      },
      error: (err: any) => {
        console.log(err)
        this.selectedRide = ride; 
        this.selectedReview = this.defaultReview;  
        this.isReviewModalOpen = true; 
      }
    })
  }
  
  closeReviewModal(): void {
    const defaultReview: Review = {
      idReview: 0,
      reviewer: null,
      reviewed: null,
      ride: null,
      review: 0,
      comment: "",
      dateReview: null  // Ajoute la date actuelle ici
    };
    this.isReviewModalOpen = false;
    this.selectedReview = undefined; // Clear the selected ride
  }
  rate(starIndex: number , passenger : any) {
    
    this.rating = starIndex;
    this.stars = this.stars.map((_, index) => index < starIndex);
  }

  submitReview(reviewed : User | null) {
    this.isProcessing = true;
    if (reviewed === null){
      this.isProcessing = false;
      this.errorMessage = "driver null ! "
    }
    const userFromLocalStorage = localStorage.getItem('user');
    if (userFromLocalStorage) {
      this.user = JSON.parse(userFromLocalStorage);
    }

    this.review = { 
      review: this.rating, 
      ride: this.selectedRide, 
      reviewer: this.user, 
      comment: this.reviewText || '', 
      reviewed: reviewed, 
      dateReview: new Date() 
    };
    console.log(this.review);
    
    this.reviewService.addReview(this.review)
    .subscribe(
      (response: any) => {
        localStorage.setItem('successMessage', 'review added successfully!');
        this.isProcessing = false;
        this.closeReviewModal()
        window.location.reload();
      },
      (error: any) => {
        this.isProcessing = false;
        this.errorMessage = 'Failed to add the review. Please try again.'; 
      }
    );
  }
  
}
