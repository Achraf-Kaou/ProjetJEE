import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import {ReviewService} from '../../services/review.service'
import { User } from '../../models/User';
import { Review } from '../../models/Review';
import { Ride } from '../../models/Ride';
import { Reservation } from '../../models/Reservation';
@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule,FormsModule,NgbRatingModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent {
  constructor(private reviewService: ReviewService){}
  rating : number = 0;
  review! : Review ;
  user !: User ;
  reviewText: string = '';
  stars: boolean[] = [false, false, false, false, false];  
  isModalVisible: boolean = true;
  isDriver : boolean=true;
  selectedPassenger: any = null;
  ride: Ride =  {
    idRide: 20,
    depart: "Yasminette",
    destination: "Ta7rir",
    places: 3,
    price: 5.0,
    description: "Mar7baa mar7baa",
    dateRide: new Date("2024-12-02T10:30:00.000+00:00"),
    status: "Terminé",
    driver: {
      idUser: 21,
      firstName: "flen",
      lastName: "fouleni",
      email: "satouriranim4@gmail.com",
      password: "flenfouleni",
      phone: "12345678",
      address: "jandouba"
    }
  }
  
  passengerList = [
    {
      "idReservation": 14,
      "ride": {
        "idRide": 20,
        "depart": "Yasminette",
        "destination": "Ta7rir",
        "places": 0,
        "price": 5.0,
        "description": "Mar7baa mar7baa",
        "dateRide": "2024-12-02T10:30:00.000+00:00",
        "status": "Terminé",
        "driver": {
          "idUser": 21,
          "firstName": "flen",
          "lastName": "fouleni",
          "email": "satouriranim4@gmail.com",
          "password": "flenfouleni",
          "phone": "12345678",
          "address": "jandouba"
        }
      },
      "passenger": {
        "idUser": 22,
        "firstName": "test",
        "lastName": "signup",
        "email": "achraf03achref@gmail.com",
        "password": "12345678",
        "phone": "52279555",
        "address": "om doniya"
      },
      "dateReservation": "2024-12-03T19:07:21.786+00:00",
      "status": "En-cours"
    },
    {
      "idReservation": 15,
      "ride": {
        "idRide": 20,
        "depart": "Yasminette",
        "destination": "Ta7rir",
        "places": 0,
        "price": 5.0,
        "description": "Mar7baa mar7baa",
        "dateRide": "2024-12-02T10:30:00.000+00:00",
        "status": "Terminé",
        "driver": {
          "idUser": 21,
          "firstName": "flen",
          "lastName": "fouleni",
          "email": "satouriranim4@gmail.com",
          "password": "flenfouleni",
          "phone": "12345678",
          "address": "jandouba"
        }
      },
      "passenger": {
        "idUser": 19,
        "firstName": "achraf",
        "lastName": "kaou",
        "email": "achraf03achref@gmail.com ",
        "password": "12345678",
        "phone": "52279555",
        "address": "tahrir"
      },
      "dateReservation": "2024-12-04T13:18:52.746+00:00",
      "status": "En-cours"
    },
    {
      "idReservation": 16,
      "ride": {
        "idRide": 20,
        "depart": "Yasminette",
        "destination": "Ta7rir",
        "places": 0,
        "price": 5.0,
        "description": "Mar7baa mar7baa",
        "dateRide": "2024-12-02T10:30:00.000+00:00",
        "status": "Terminé",
        "driver": {
          "idUser": 21,
          "firstName": "flen",
          "lastName": "fouleni",
          "email": "satouriranim4@gmail.com",
          "password": "flenfouleni",
          "phone": "12345678",
          "address": "jandouba"
        }
      },
      "passenger": {
        "idUser": 20,
        "firstName": "Ranim",
        "lastName": "Satouri",
        "email": "ranimsatouri23@gmail.com",
        "password": "ranimranim",
        "phone": "54378096",
        "address": "yasminette"
      },
      "dateReservation": "2024-12-04T13:19:05.795+00:00",
      "status": "En-cours"
    },
    {
      "idReservation": 17,
      "ride": {
        "idRide": 20,
        "depart": "Yasminette",
        "destination": "Ta7rir",
        "places": 0,
        "price": 5.0,
        "description": "Mar7baa mar7baa",
        "dateRide": "2024-12-02T10:30:00.000+00:00",
        "status": "Terminé",
        "driver": {
          "idUser": 21,
          "firstName": "flen",
          "lastName": "fouleni",
          "email": "satouriranim4@gmail.com",
          "password": "flenfouleni",
          "phone": "12345678",
          "address": "jandouba"
        }
      },
      "passenger": {
        "idUser": 21,
        "firstName": "flen",
        "lastName": "fouleni",
        "email": "satouriranim4@gmail.com",
        "password": "flenfouleni",
        "phone": "12345678",
        "address": "jandouba"
      },
      "dateReservation": "2024-12-04T13:19:15.839+00:00",
      "status": "En-cours"
    }
  ]; 
 
  closeModal() {
    this.isModalVisible = false;
  }

  rate(starIndex: number) {
    this.rating = starIndex;
    this.stars = this.stars.map((_, index) => index < starIndex);
  }

  submitReview(reviewed : User) {
    console.log(this.review);
    const userFromLocalStorage = localStorage.getItem('user');
    if (userFromLocalStorage) {
      this.user = JSON.parse(userFromLocalStorage);
    }
    console.log(this.ride.driver);
    this.review = { 
      review: this.rating, 
      ride: this.ride, 
      reviewer: this.user, 
      comment: this.reviewText || '', 
      reviewed: reviewed, 
      dateReview: new Date() 
    };
    console.log(this.review);
    
    this.reviewService.addReview(this.review)
    .subscribe(
      (response: any) => {
        console.log(response);
        this.closeModal();
      },
      (error: any) => {
        console.error('SignIn error:', error);  
      }
    );
  }
  selectPassenger(passenger: any) {
    this.selectedPassenger = passenger;
  }

}

// this.closeModal();
    // const userFromLocalStorage = localStorage.getItem('user');
    // if (userFromLocalStorage) {
    //   this.user = JSON.parse(userFromLocalStorage);
    // }
    // this.reviewService.getNotReviewedRides(this.user.idUser)
    // .subscribe(
    //   (response: any) => {
    //     console.log(response);
    //   },
    //   (error: any) => {
    //     console.error('SignIn error:', error);
       
    //   }
    // );
