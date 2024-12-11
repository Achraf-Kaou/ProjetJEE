import { Component, EventEmitter, OnInit, Output, output } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { ViewProfileComponent } from "../../components/view-profile/view-profile.component";
import { User } from '../../models/User';
import { ReviewComponent } from "../../components/review/review.component";
import { Reservation } from '../../models/Reservation';
import { Ride } from '../../models/Ride';
import { ReviewService } from '../../services/review.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [NavbarComponent, ViewProfileComponent, ReviewComponent, CommonModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent implements OnInit {
    storedUser!: User ;
    isDriver : boolean=false;
    passengerList: Reservation[] = [];
    ride !: Ride ;
    isModalVisible: boolean = false;
    isLoading: boolean = true;
    constructor(private reviewService: ReviewService){}
    openModal() {
      this.isModalVisible = true;
    }
    ngOnInit () {
      const userFromLocalStorage = localStorage.getItem('user');
      if (userFromLocalStorage) {
        this.storedUser = JSON.parse(userFromLocalStorage);
      }
      this.reviewService.getNotReviewedRides(this.storedUser.idUser)
    .subscribe(
      (response: any) => {
        if (Array.isArray(response) && response.length > 0) {
          this.ride = response[0]; 
          if(this.ride.driver?.idUser == this.storedUser.idUser){
            this.isDriver = true;
            this.reviewService.getNotReviewedPassengerByRide(this.ride.idRide)
            .subscribe(
              (response: any) => {
                if (Array.isArray(response) && response.length > 0) {
                  this.passengerList = response; 
                  console.log("affichage fel home",this.passengerList)
                  console.log("affichage fel home",this.isDriver)
                  this.openModal();
                  console.log("affichage fel home",this.isModalVisible)

                } else {
                  console.log('Tous les passenger sont evaluées');
                }
              },
              (error: any) => {
                console.error('fetching not review error:', error);
              }
            );
          }else{
            this.openModal();
          }
          
        } else {
          console.log('Aucun ride non évalué trouvé.');
        }
        this.isLoading = false;
      },
      (error: any) => {
        console.error('SignIn error:', error);
        this.isLoading = false;
      }
    );
    }
}
