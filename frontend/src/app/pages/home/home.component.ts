import { Component, Input, Output } from '@angular/core';
import { User } from '../../models/User';
import {ReviewService} from '../../services/review.service'
import { ReviewComponent } from "../../components/review/review.component";
import { Reservation } from '../../models/Reservation';
import { Ride } from '../../models/Ride';
import { ReservationService } from '../../services/reservation.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { RideListComponent } from "../../components/ride-list/ride-list.component";
import { FilterFormComponent } from "../../components/filter-form/filter-form.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReviewComponent, CommonModule, NavbarComponent, RideListComponent, FilterFormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private reviewService: ReviewService,private reservationService: ReservationService){}
  user !: User ;
  isDriver : boolean=false;
  passengerList: Reservation[] = [];
  ride !: Ride 
  isModalVisible: boolean = false;
  ListRides : Ride[] = []
  
  openModal() {
    this.isModalVisible = true;
  }
  ngOnInit() {
    const userFromLocalStorage = localStorage.getItem('user');
    if (userFromLocalStorage) {
      this.user = JSON.parse(userFromLocalStorage);
    }
    this.reviewService.getNotReviewedRides(this.user.idUser)
    .subscribe(
      (response: any) => {
        if (Array.isArray(response) && response.length > 0) {
          this.ride = response[0]; 
          if(this.ride.driver.idUser == this.user.idUser){
            this.isDriver = true;
            this.reviewService.getNotReviewedPassengerByRide(this.ride.idRide)
            .subscribe(
              (response: any) => {
                if (Array.isArray(response) && response.length > 0) {
                  this.passengerList = response; 
                  console.log("affichage fel home",this.passengerList)
                  console.log("affichage fel home",this.isDriver)
                  this.openModal();
                } else {
                  console.log('Tous les passenger sont evaluées');
                }
              },
              (error: any) => {
                console.error('SignIn error:', error);
              
              }
            );
          }else{
            this.openModal();
          }
          
        } else {
          console.log('Aucun ride non évalué trouvé.');
        }
      },
      (error: any) => {
        console.error('SignIn error:', error);
       
      }
    );
    
  }
  handleListRidesUpdate(rides: Ride[]) {
    this.ListRides = rides;
    console.log(this.ListRides);
  }
}