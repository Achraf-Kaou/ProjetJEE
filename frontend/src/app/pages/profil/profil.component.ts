import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { ViewProfileComponent } from "../../components/view-profile/view-profile.component";

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [NavbarComponent, ViewProfileComponent],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent {

}
