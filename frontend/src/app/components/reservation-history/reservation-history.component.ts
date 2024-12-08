import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Reservation } from '../../models/Reservation';
import { User } from '../../models/User';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-reservation-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservation-history.component.html',
  styleUrl: './reservation-history.component.css'
})
export class ReservationHistoryComponent {
  reservations: Reservation[] = [];
  /* @Input()  */user!: User;
  isLoading: boolean = true;
  isProcessing: boolean = false;
  errorMessage: string = '';
  successMessage: string | null = null;

  constructor(private reservationService: ReservationService){}
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
    this.reservationService.getAllReservationByUser(user.idUser).subscribe({
      next: (data) => {
        this.reservations = data;
        this.isLoading = false;
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
