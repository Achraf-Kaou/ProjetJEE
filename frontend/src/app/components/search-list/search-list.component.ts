import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { User } from '../../models/User';

@Component({
  selector: 'app-search-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-list.component.html',
  styleUrl: './search-list.component.css'
})
export class SearchListComponent {
  @Input() users !: User[] 
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['users']) {
      this.users=this.users
      console.log('Les données ont été mises à jour:', this.users);
    }
  }

}
