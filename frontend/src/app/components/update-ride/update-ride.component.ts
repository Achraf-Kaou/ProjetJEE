import { CommonModule, JsonPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbAlertModule, NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { Ride } from '../../models/Ride';
import { RideService } from '../../services/ride.service';
import { User } from '../../models/User';

@Component({
  selector: 'app-update-ride',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgbAlertModule, NgbTimepickerModule, NgbDatepickerModule],
  templateUrl: './update-ride.component.html',
  styleUrl: './update-ride.component.css'
})
export class UpdateRideComponent implements OnInit {
  updateRideForm !: FormGroup ;
  ride:Ride={
    idRide: 54,
    depart: "bou ja3fer",
    destination: "ras tabiya",
    places: 0,
    price: 20.0,
    description: "",
    dateRide: new Date("2024-12-09T14:19:00.000+00:00"),
    status: "Terminé",
    driver: {
      idUser: 22,
      firstName: "test",
      lastName: "test",
      email: "achraf03achref@gmail.com",
      password: "123456789",
      phone: "52279555",
      address: "om doniya"
    }
  }
  user!: User;

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
    this.updateRideForm = new FormGroup({
      depart: new FormControl(this.ride.depart, [Validators.required]),
      destination: new FormControl(this.ride.destination, [Validators.required]),
      places: new FormControl(this.ride.places, [
        Validators.required,
        Validators.min(1),
        Validators.max(4),
        Validators.pattern('^[0-9]*$')
      ]),
      price: new FormControl(this.ride.price, [Validators.required, Validators.min(0)]),
      dateRide: new FormControl(this.formatDate(this.ride.dateRide), [Validators.required]),
      timeRide: new FormControl(this.formatTime(this.ride.dateRide), Validators.required),
      description: new FormControl(this.ride.description)
    });
  }


  // Formater la date pour le pré-remplissage du formulaire
  private formatDate(dateRide: string | Date): any {
    const date = new Date(dateRide);
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
  }

  // Formater l'heure pour le pré-remplissage du formulaire
  private formatTime(dateRide: string | Date): any {
    const date = new Date(dateRide);
    return {
      hour: date.getHours(),
      minute: date.getMinutes()
    };
  }



   // Méthode pour soumettre les données mises à jour
   onSubmit(): void {
    this.updateRideForm.markAllAsTouched();

    const userFromLocalStorage = localStorage.getItem('user');
    if (userFromLocalStorage) {
      this.user = JSON.parse(userFromLocalStorage);
    }

    if (this.updateRideForm.valid) {
      const date = this.updateRideForm.get('dateRide')?.value;
      const time = this.updateRideForm.get('timeRide')?.value;

      const formattedDate = `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`;
      const formattedTime = `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}:00`;

      const dateTimeString = `${formattedDate}T${formattedTime}`;

      // Mettre à jour la course avec les nouvelles données
      this.ride = {
        ...this.ride, // Conserver les données existantes
        depart: this.updateRideForm.get('depart')?.value,
        destination: this.updateRideForm.get('destination')?.value,
        places: this.updateRideForm.get('places')?.value,
        price: this.updateRideForm.get('price')?.value,
        dateRide: new Date(dateTimeString),
        description: this.updateRideForm.get('description')?.value || ''
      };

      this.rideService.updateRide(this.ride).subscribe(
        (response: any) => {
          console.log('Ride updated successfully:', response);
        },
        (error: any) => {
          console.error('Update error:', error);
        }
      );
    }
  }

}



  

  
