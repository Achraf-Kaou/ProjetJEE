import { Component, Input } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { Router } from '@angular/router';
import { Review } from '../../models/Review';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-review-update',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbRatingModule],
  templateUrl: './review-update.component.html',
  styleUrl: './review-update.component.css'
})
export class ReviewUpdateComponent {
  constructor(private reviewService: ReviewService, private router: Router) {}

  rating: number = 0;
  @Input() review: Review = {
    idReview: 42,
    reviewer: {
        idUser: 19,
        firstName: "achraf",
        lastName: "kaou",
        email: "achraf03achraf@gmail.com",
        password: "12345678",
        phone: "52279555",
        address: "tahrir"
    },
    reviewed: {
        idUser: 23,
        firstName: "karim",
        lastName: "satouri",
        email: "ranimsatouri@gmail.com",
        password: "karim123456",
        phone: "54378096",
        address: "7ay el wife9"
    },
    ride: {
        idRide: 22,
        depart: "gabes",
        destination: "mannouba",
        places: 0,
        price: 5.0,
        description: "yalla bina yalla",
        dateRide: new Date("2024-12-02T11:30:00.000+00:00"),
        status: "Terminé",
        driver: {
            idUser: 23,
            firstName: "karim",
            lastName: "satouri",
            email: "ranimsatouri@gmail.com",
            password: "karim123456",
            phone: "54378096",
            address: "7ay el wife9"
        }
    },
    review: 3,
    comment: "",
    dateReview: new Date()  // Ajoute la date actuelle ici
   };
  
  @Input() isModalVisible: boolean = true;
  @Input() isDriver: boolean = false;


  reviewText: String = '';
  stars: boolean[] = [false, false, false, false, false];
  isProcessing: boolean = false;
  errorMessage: string = '';

  ngOnInit() {
    if (this.review) {
      if(!this.isDriver){
        this.reviewText = this.review.comment;
      }
      this.rating = this.review.review;
    }
  }

  closeModal() {
    this.isModalVisible = false;
  }

  rate(starIndex: number, passenger: any) {
    if (this.isDriver) {
      passenger.rate = starIndex;
    }
    this.rating = starIndex;
    this.stars = this.stars.map((_, index) => index < starIndex);
  }

  updateReview() {
    this.isProcessing = true;
    if (!this.review) {
      this.isProcessing = false;
      this.errorMessage = "Review not found!";
      return;
    }

    // Mise à jour de la revue
    this.review = {
      ...this.review,
      review: this.rating,
      comment: this.reviewText || '',
    };

    this.reviewService.updateReview(this.review).subscribe(
      (response: any) => {
        localStorage.setItem('successMessage', 'Review updated successfully!');
        this.isProcessing = false;
        this.closeModal();
      },
      (error: any) => {
        this.isProcessing = false;
        this.errorMessage = 'Failed to update the review. Please try again.';
      }
    );
  }

}