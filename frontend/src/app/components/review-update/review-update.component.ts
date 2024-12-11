import { Component, Input, SimpleChanges } from '@angular/core';
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
  @Input() review: Review= {
    idReview: 0,
    reviewer: null,
    reviewed: null,
    ride: null,
    review: 0,
    comment: "",
    dateReview: new Date()  // Ajoute la date actuelle ici
  };;
  @Input() isDriver: boolean = false;


  reviewText: String = '';
  stars: boolean[] = [false, false, false, false, false];
  isProcessing: boolean = false;
  errorMessage: string = '';

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['review']){
      if (this.review) {
        console.log(this.review);
        if(!this.isDriver){
          this.reviewText = this.review.comment;
        }
        this.rating = this.review.review;
      }
    }
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
        window.location.reload();
      },
      (error: any) => {
        this.isProcessing = false;
        this.errorMessage = 'Failed to update the review. Please try again.';
      }
    );
  }

}