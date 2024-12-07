import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbAlert, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, Subject, tap } from 'rxjs';
import { Ride } from '../../models/Ride';
import { RideService } from '../../services/ride.service';
import { User } from '../../models/User';

@Component({
  selector: 'app-add-ride',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgbAlertModule],
  templateUrl: './add-ride.component.html',
  styleUrl: './add-ride.component.css'
})
export class AddRideComponent {
    addRideForm !: FormGroup ;
    ride!:Ride;
    user !: User ;
    constructor(private rideService: RideService) {}
  
    ngOnInit(): void {
      this.addRideForm = new FormGroup({
        depart: new FormControl('', [Validators.required]),
        destination: new FormControl('', [Validators.required]),
        places: new FormControl('',[Validators.required, Validators.min(1), Validators.max(4)]),
        price: new FormControl('', [Validators.required, Validators.min(0)]),
        dateRide: new FormControl('', Validators.required),
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
        // Créer l'objet ride en récupérant les données du formulaire
        this.ride = {
          depart: this.addRideForm.get('depart')?.value,
          destination: this.addRideForm.get('destination')?.value,
          places: this.addRideForm.get('places')?.value,
          price: this.addRideForm.get('price')?.value,
          dateRide: this.addRideForm.get('dateRide')?.value,
          description: this.addRideForm.get('description')?.value || '',
          status: '',
          driver : this.user 
        };
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