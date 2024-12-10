import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Reservation } from '../../models/Reservation';
import { User } from '../../models/User';
import { ReservationService } from '../../services/reservation.service';
import { Review } from '../../models/Review';
import { catchError, of, map, forkJoin } from 'rxjs';
import { ReviewService } from '../../services/review.service';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reservation-history',
  standalone: true,
  imports: [CommonModule, NgbRatingModule],
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
              of({
                id: 0,
                ride: null,
                reviewer: null,
                reviewed: null,
                dateReview: null,
                review: 0,
                comment: ''
              })
            ),
            map((review) => ({ reservation, review }))
          )
        );
  
        forkJoin(reservationWithReviews$).subscribe({
          next: (results) => {
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
}
