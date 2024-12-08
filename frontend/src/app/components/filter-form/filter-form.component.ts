import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, output, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { RideService } from '../../services/ride.service';
import { HttpParams } from '@angular/common/http';
import { Ride } from '../../models/Ride';

@Component({
  selector: 'app-filter-form',
  standalone: true,
  imports: [NgbTimepickerModule, NgbDatepickerModule,ReactiveFormsModule, CommonModule],
  templateUrl: './filter-form.component.html',
  styleUrl: './filter-form.component.css'
})
export class FilterFormComponent {
  filterForm!: FormGroup;
  router: any;
  constructor(private rideService: RideService) {}
  // Time model for the timepicker
  time = { hour: 12, minute: 0 };
  onListRidesUpdate = output<Ride[]>();
  
  ngOnInit(): void {
    this.filterForm = new FormGroup({
      depart: new FormControl(''),
      destination: new FormControl(''),
      maxPrice: new FormControl('', [Validators.min(0)]),
      dateRide: new FormControl(''),
      timeRide: new FormControl(''),
    });
  }

  onSubmit(): void {
     
    const depart = this.filterForm.get("depart")?.value || '';
    const destination = this.filterForm.get("destination")?.value || '';
    const maxPrice = this.filterForm.get("maxPrice")?.value || '';
    const dateRide = this.filterForm.get("dateRide")?.value;
    const timeRide = this.filterForm.get("timeRide")?.value;
  
    let dateTimeString = '';
    if (dateRide && timeRide) {
      const formattedDate = `${dateRide.year}-${dateRide.month.toString().padStart(2, '0')}-${dateRide.day.toString().padStart(2, '0')}`;
      const formattedTime = `${timeRide.hour.toString().padStart(2, '0')}:${timeRide.minute.toString().padStart(2, '0')}:00`;
      dateTimeString = `${formattedDate} ${formattedTime}`;
      console.log(dateTimeString);
    }
    if (dateRide && !timeRide) {
      const formattedDate = `${dateRide.year}-${dateRide.month.toString().padStart(2, '0')}-${dateRide.day.toString().padStart(2, '0')}`;
      const formattedTime = '00:00:00';
      dateTimeString = `${formattedDate} ${formattedTime}`;
      console.log(dateTimeString);
    }

  
    // Créer dynamiquement les paramètres
    let params = new HttpParams();
    if (depart) params = params.set('depart', depart);
    if (destination) params = params.set('destination', destination);
    if (maxPrice) params = params.set('price', maxPrice);
    if (dateTimeString) params = params.set('dateRide', dateTimeString);
      
      console.log(params)
      this.rideService.all(params ).subscribe({
        next:(response) => {
          console.log(response);
          this.onListRidesUpdate.emit(response); 
        },
        error:(error) => {
          console.error('filter error:', error);
        },
    });
    
   
  }
}
