import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbAlertModule, NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { Ride } from '../../models/Ride';
import { RideService } from '../../services/ride.service';
import { User } from '../../models/User';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-ride',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgbAlertModule, NgbTimepickerModule, NgbDatepickerModule, NavbarComponent],
  templateUrl: './add-ride.component.html',
  styleUrl: './add-ride.component.css'
})
export class AddRideComponent {
    addRideForm !: FormGroup ;
    ride!:Ride;
    user !: User ;
    isProcessing!: boolean;
    errorMessage: string = "";
    successMessage: string | null = null;
    constructor(private rideService: RideService, private router: Router) {}
   
    ngOnInit(): void {
      this.addRideForm = new FormGroup({
        depart: new FormControl('', [Validators.required]),
        destination: new FormControl('', [Validators.required]),
        places: new FormControl('',[Validators.required, Validators.min(1), Validators.max(4),Validators.pattern('^[0-9]*$')]),
        price: new FormControl('', [Validators.required, Validators.min(0)]),
        dateRide: new FormControl('', Validators.required),
        timeRide: new FormControl('', Validators.required),
        description: new FormControl(''),
      });
    }
  
    onSubmit(): void {
      this.isProcessing = true;
      this.addRideForm.markAllAsTouched();
      const userFromLocalStorage = localStorage.getItem('user');
      if (userFromLocalStorage) {
        this.user = JSON.parse(userFromLocalStorage);
      }
      if (this.addRideForm.valid) {
        const date = this.addRideForm.get('dateRide')?.value; 
        const time = this.addRideForm.get('timeRide')?.value; 
        
        const formattedDate = `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`;
        const formattedTime = `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}:00`;

        const dateTimeString = `${formattedDate}T${formattedTime}`;
        console.log(dateTimeString )
       
        this.ride = {
          depart: this.addRideForm.get('depart')?.value,
          destination: this.addRideForm.get('destination')?.value,
          places: this.addRideForm.get('places')?.value,
          price: this.addRideForm.get('price')?.value,
          dateRide: new Date(dateTimeString),
          description: this.addRideForm.get('description')?.value || '',
          status: '',
          driver : this.user 
        };
        console.log(this.ride.dateRide)
        this.rideService.addRide(this.ride)
        .subscribe({
          next: (response: any) => {
            this.isProcessing = false;
            localStorage.setItem('successMessage', 'ride added successfully!');
            this.router.navigateByUrl('/home'); 
          },
          error: (error: any) => {
            this.isProcessing = false;
            this.errorMessage = "failed to add ride try again later!";
          }
        });
        
      }
    }
  }