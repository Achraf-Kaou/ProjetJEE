import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import {ReviewService} from '../../services/review.service'
import { User } from '../../models/User';
import { Review } from '../../models/Review';
import { Ride } from '../../models/Ride';
import { Reservation } from '../../models/Reservation';
import { Router } from '@angular/router';
@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule,FormsModule,NgbRatingModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent {
  constructor(private reviewService: ReviewService,private router: Router){}
  rating : number = 0;
  review! : Review ;
  @Input() user !: User ;
  reviewText: string = '';
  stars: boolean[] = [false, false, false, false, false];  
  @Input() isModalVisible: boolean = true;
  @Input() isDriver !: boolean;
  selectedPassenger: any = null;
  @Input() passengerList!: Reservation[] ;
  newPassengerList: any= [];
  @Input() ride !: Ride ;
  isProcessing: boolean = false;
  errorMessage: string = '';
  ngOnInit() {
    // Exemple d'initialisation
    console.log("affichage fel review",this.passengerList)
    console.log("affichage fel review",this.isDriver)
    this.newPassengerList = this.passengerList.map(reservation => ({
      ...reservation,
      passenger: {
        ...reservation.passenger,
        rate: 0 
      }
    }));
  }
  
  
  closeModal() {
    this.isModalVisible = false;
  }

  rate(starIndex: number , passenger : any) {
    if(this.isDriver){
      passenger.rate= starIndex
    }
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
        localStorage.setItem('successMessage', 'review added successfully!');
        this.isProcessing = false;
        this.closeModal()
        window.location.reload();
      },
      (error: any) => {
        this.isProcessing = false;
        this.errorMessage = 'Failed to add the review. Please try again.'; 
      }
    );
  }
  selectPassenger(passenger: any) {
    this.selectedPassenger = passenger;
  }

}



