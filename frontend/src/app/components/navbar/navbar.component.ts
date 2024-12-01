import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent {
  constructor(private userService: UserService, private router: Router){}
  searchControl = new FormControl('');
 
 
  onSearch() {
    console.log('onSearch() called'); 
    const searchValue = this.searchControl.value;
    console.log('Search Value:', searchValue); 
    if (searchValue != null && searchValue.trim() !== '') { 
      console.log('Sending search request...');
      this.userService.searchForUser(searchValue, searchValue)
        .subscribe(
          (response: any) => {
            console.log('Search Results:', response);
          },
          (error: any) => {
            console.error('Search Error:', error);
          }
        );
    } else {
      console.warn('Search value is empty!');
    }
  }
  
}
