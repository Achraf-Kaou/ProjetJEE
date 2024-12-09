import { Component, EventEmitter, Output, output } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { ViewProfileComponent } from "../../components/view-profile/view-profile.component";
import { User } from '../../models/User';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [NavbarComponent, ViewProfileComponent],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent {
    storedUser!: User ;

    ngOnInit () {
      const userFromLocalStorage = localStorage.getItem('user');
      if (userFromLocalStorage) {
        this.storedUser = JSON.parse(userFromLocalStorage);
      }
      
    }
}
