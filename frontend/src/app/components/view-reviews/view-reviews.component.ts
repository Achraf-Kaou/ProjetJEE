import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Review } from '../../models/Review';

@Component({
  selector: 'app-view-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-reviews.component.html',
  styleUrl: './view-reviews.component.css'
})
export class ViewReviewsComponent {
  @Input() reviews: Review[] = [ 
  {
    idReview: 2,
    ride: {
      idRide: 102,
      depart: 'Sfax',
      destination: 'Monastir',
      dateRide: new Date('2024-12-20T14:00:00'),
      status :"Terminé",
      driver: {
        idUser: 3,
        firstName: 'Khaled',
        lastName: 'Trabelsi',
        email: 'khaled.trabelsi@example.com',
        password: 'password123',
        address: 'Sfax, Tunisia',
        phone: '12312345',
      },
      price: 25,
      places: 2,
      description: 'Spacious car with air conditioning.',
    },
    reviewer: {
      idUser: 4,firstName: 'Salma',
      lastName: 'Jemaa',
      email: 'salma.jemaa@example.com',
      password: 'password123',
      address: 'Gabes, Tunisia',
      phone: '78945612',
    },
    reviewed: {
      idUser: 3,
      firstName: 'Khaled',
      lastName: 'Trabelsi',
      email: 'khaled.trabelsi@example.com',
      password: 'password123',
      address: 'Sfax, Tunisia',
      phone: '12312345',
    },
    dateReview: new Date('2024-12-10T16:00:00'),
    review: 4,
    comment: 'Excellent driver! The trip was smooth and enjoyable.',
  },
  {
    idReview: 2,
    ride: {
      idRide: 102,
      depart: 'Sfax',
      destination: 'Monastir',
      dateRide: new Date('2024-12-20T14:00:00'),
      status :"Terminé",
      driver: {
        idUser: 3,
        firstName: 'Khaled',
        lastName: 'Trabelsi',
        email: 'khaled.trabelsi@example.com',
        password: 'password123',
        address: 'Sfax, Tunisia',
        phone: '12312345',
      },
      price: 25,
      places: 2,
      description: 'Spacious car with air conditioning.',
    },
    reviewer: {
      idUser: 4,firstName: 'Salma',
      lastName: 'Jemaa',
      email: 'salma.jemaa@example.com',
      password: 'password123',
      address: 'Gabes, Tunisia',
      phone: '78945612',
    },
    reviewed: {
      idUser: 3,
      firstName: 'Khaled',
      lastName: 'Trabelsi',
      email: 'khaled.trabelsi@example.com',
      password: 'password123',
      address: 'Sfax, Tunisia',
      phone: '12312345',
    },
    dateReview: new Date('2024-12-10T16:00:00'),
    review: 4,
    comment: 'Very professional driver, but the car could have been cleaner.',
  },
];
}
