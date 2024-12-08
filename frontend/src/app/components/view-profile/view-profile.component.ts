import { Component } from '@angular/core';
import { User } from '../../models/User';
import { RideHistoryComponent } from "../ride-history/ride-history.component";
import { ReservationHistoryComponent } from "../reservation-history/reservation-history.component";
import { ReviewService } from '../../services/review.service';
import { CommonModule } from '@angular/common';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [RideHistoryComponent, ReservationHistoryComponent, CommonModule, NgbRatingModule,RouterModule, ReactiveFormsModule],
  templateUrl: './view-profile.component.html',
  styleUrl: './view-profile.component.css'
})
export class ViewProfileComponent {
  user!: User;
  userReview!: number;
  isLoading: boolean = true;
  isProcessing: boolean = false;
  errorMessage: string = '';
  successMessage: string | null = null;
  isOwnerProfile: boolean = false;
  isDeleteModalOpen = false;
  isEditModalOpen = false;
  editUserForm!: FormGroup;
  showPassword!: boolean;
  formError: boolean = false;

  constructor(private reviewService: ReviewService, private route: ActivatedRoute, private router: Router, private userService: UserService){}

  ngOnInit() {
    this.editUserForm = new FormGroup({
      email: new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('',[Validators.required ,Validators.minLength(8)]),
      firstname: new FormControl('' , [Validators.required ]),
      lastname: new FormControl('' , [Validators.required ]),
      phone : new FormControl('' , [Validators.required,Validators.pattern(/^\d{8}$/)]),
      address : new FormControl('' , [Validators.required]),
    });
    this.showPassword = false;
    const message = localStorage.getItem('successMessage');
    if (message) {
      this.successMessage = message;
      localStorage.removeItem('successMessage');
    }
    const userFromLocalStorage = localStorage.getItem('user');
    if (userFromLocalStorage) {
      this.user = JSON.parse(userFromLocalStorage);
    }
    let profileId = '';
    this.route.params.subscribe(params => {
      profileId = params['id']; // This gets the 'id' param from the URL
      this.isOwnerProfile = this.isOwner(profileId);
    });
    if (!this.isOwnerProfile) {
      this.userService.getUserById(profileId).subscribe({
        next: (user: User) => {
          this.user = user;
        },
        error: (err: any) => {
          this.errorMessage = "can't find user"
        }
      })
    }
    this.getMeanReviewByUser();
  }

  getMeanReviewByUser() {
    this.reviewService.getMeanReviewByUser(this.user.idUser).subscribe({
      next: (response) => {
        console.log(response);
        this.userReview = response;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load review. Please try again later.';
        this.isLoading = false;
      }
    })
  }
  isOwner(profileId: string): boolean {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  
    // Check if storedUser and storedUser.idUser exist before comparing
    if (storedUser && storedUser.idUser) {
      return storedUser.idUser.toString() === profileId;
    }
  
    // If storedUser or storedUser.idUser is not defined, return false
    return false;
  }
  
  deleteProfile() {
    this.isProcessing = true;
    this.userService.deleteUser(this.user.idUser).subscribe({
      next: () => {
        this.closeDeleteModal();
        window.location.reload();
        this.isProcessing = false;
      },
      error: (err: any) => {
        this.isProcessing = false;
        this.errorMessage = "can't delete, try again later"
        this.closeDeleteModal();
      }
    });
  }

  openDeleteModal(): void {
    this.isDeleteModalOpen = true; // Open the modal
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
  }

  editProfile() {
    this.isProcessing = true; // Indicate processing
    this.editUserForm.markAllAsTouched(); // Mark all fields as touched
    if (this.editUserForm.invalid) {
      this.formError = true; // Show form error if invalid
      this.isProcessing = false; // Stop processing
      return;
    }
  
    const updatedUser: User = {
      idUser: this.user.idUser,
      firstName: this.editUserForm.get('firstname')?.value,
      lastName: this.editUserForm.get('lastname')?.value,
      email: this.editUserForm.get('email')?.value,
      password: this.editUserForm.get('password')?.value,
      address: this.editUserForm.get('address')?.value,
      phone: this.editUserForm.get('phone')?.value, // Fix phone value
    };
  
    this.userService.updateUser(updatedUser).subscribe({
      next: (response) => {
        this.closeEditModal();
        localStorage.setItem('successMessage', 'User updated successfully!');
        localStorage.setItem('user', JSON.stringify(updatedUser)); // Update local storage
        this.isProcessing = false;
        window.location.reload();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to update. Please try again.';
        this.isProcessing = false;
      },
    });
  }
  

  openEditModal(): void {
    this.editUserForm.patchValue({
      email: this.user.email,
      password: this.user.password,
      firstname: this.user.firstName,
      lastname: this.user.lastName,
      phone: this.user.phone,
      address: this.user.address,
    });
    this.showPassword = false;
    this.isEditModalOpen = true;
  }
  

  closeEditModal(): void {
    this.isEditModalOpen = false;
  }
}
