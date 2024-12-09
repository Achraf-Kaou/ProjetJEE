import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RideService } from './services/ride.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'co-voiturage';
  isLoading = true;
  constructor(private rideService: RideService){}

  ngOnInit(){
    this.rideService.terminateRides().subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.log(err);
      }
    })
  }
}
