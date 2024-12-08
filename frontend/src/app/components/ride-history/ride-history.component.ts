import { Component, OnInit } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap'
import { Ride } from '../../models/Ride';
import { ReservationService } from '../../services/reservation.service';
import { RideService } from '../../services/ride.service';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Reservation } from '../../models/Reservation';
import { User } from '../../models/User';
import { response } from 'express';

@Component({
  selector: 'app-ride-history',
  standalone: true,
  imports: [NgbAccordionModule, CommonModule],
  templateUrl: './ride-history.component.html',
  styleUrl: './ride-history.component.css'
})
export class RideHistoryComponent implements OnInit {
  rides: {ride: Ride; reservations: Reservation[]}[] = [];
  isLoading: boolean = true;
  isProcessing: boolean = false;
  errorMessage: string = '';
  successMessage: string | null = null;
  /* @Input()  */ user!: User;
  isDeleteModalOpen = false;
  selectedRide: Ride | null = null;

  constructor(private rideService: RideService, private reservationService: ReservationService) {}

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

  getRidesWithReservations(): Observable<any[]> {
    return this.rideService.getAllRideByUser(this.user.idUser).pipe(
      switchMap((rides: any[]) => {
        if (rides.length === 0) {
          this.errorMessage = 'No rides found for this user.';
          this.isLoading = false;
          return [];  // Return an empty array to stop further requests
        }

        const requests = rides.map((ride) =>
          this.reservationService.getAllReservationByRide(ride.idRide).pipe(
            map((reservations) => ({
              ride,
              reservations,
              errorMessage: reservations.length === 0 
                ? 'No reservations found for this ride' 
                : null,
            }))
          )
        );
        return forkJoin(requests);
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

