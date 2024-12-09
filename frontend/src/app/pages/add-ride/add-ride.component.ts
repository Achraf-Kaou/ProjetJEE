import { CommonModule, JsonPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbAlert, NgbAlertModule, NgbDatepickerModule, NgbInputDatepicker, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, Subject, tap } from 'rxjs';
import { Ride } from '../../models/Ride';
import { RideService } from '../../services/ride.service';
import { User } from '../../models/User';
import { NavbarComponent } from "../../components/navbar/navbar.component";

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
    constructor(private rideService: RideService) {}
    isFutureDateTime(date: any, time: any): boolean {
      if (!date || !time) {
        return false; 
      }
      const inputDate = new Date(
        date.year,
        date.month - 1, 
        date.day,
        time.hour,
        time.minute
      );
      const now = new Date(); 
      return inputDate > now; 
    }
    
    ngOnInit(): void {
      this.addRideForm = new FormGroup({
        depart: new FormControl('', [Validators.required]),
        destination: new FormControl('', [Validators.required]),
        places: new FormControl('',[Validators.required, Validators.min(1), Validators.max(4),Validators.pattern('^[0-9]*$')]),
        price: new FormControl('', [Validators.required, Validators.min(0)]),
        dateRide: new FormControl('', [Validators.required]),
        timeRide: new FormControl('', Validators.required),
        description: new FormControl(''),
      });
    }
  
    onSubmit(): void {
      this.addRideForm.markAllAsTouched();
      const userFromLocalStorage = localStorage.getItem('user');
      if (userFromLocalStorage) {
        this.user = JSON.parse(userFromLocalStorage);
      }
      if (this.addRideForm.valid) {
        const date = this.addRideForm.get('dateRide')?.value; 
        const time = this.addRideForm.get('timeRide')?.value; 
        // if (!this.isFutureDateTime(date, time)) {
        //   this.errorMessage = "The selected date and time must be in the future. Please choose a valid date and time.";
        //   return; 
        // }
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
        .subscribe(
          (response: any) => {
            console.log(response);
            
          },
          (error: any) => {
            console.error('Registration error:', error);
          }
        );
        
      }
    }
  }