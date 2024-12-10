import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { Review } from '../../models/Review';
import { Ride } from '../../models/Ride';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-view-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-reviews.component.html',
  styleUrl: './view-reviews.component.css'
})
export class ViewReviewsComponent {
  @Input() ride!: Ride;
  reviews!: Review[];
  errorMessage!: string;
  isLoading: boolean = true;
  constructor(private reviewService: ReviewService){}

  ngOnInit() {
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ride']){
      this.getAllReviewByRide();
    }
  }
  getAllReviewByRide() {
    console.log(this.ride)
    this.reviewService.getAllReviewByRide(this.ride.idRide).subscribe({
      next: (value) => {
        console.log(value);
        this.reviews = value;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = "Error getting all reviews from Ride"
        this.isLoading = false;
      }
      
    })
  }
}
