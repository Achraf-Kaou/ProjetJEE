import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../models/User';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent {
  constructor(private userService: UserService, private router: Router){}
  searchControl = new FormControl('');
  isNavbarOpen = false; 
  @Output() onListUsersUpdate = new EventEmitter<User[]>();
  user!: User;

  ngOnInit() {
    const userFromLocalStorage = localStorage.getItem('user');
    if (userFromLocalStorage) {
      this.user = JSON.parse(userFromLocalStorage);
    }
  }
  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen; 
    console.log('navbar open:',this.isNavbarOpen);
  }
 
  onSearch() {
    console.log('onSearch() called');
    const searchValue = this.searchControl.value;
    console.log('Search Value:', searchValue);
  
    if (searchValue != null && searchValue.trim() !== '') {
      
      const searchWords = searchValue.split(' ').filter(word => word.trim() !== '');  
  
      console.log('Separated Search Words:', searchWords);
  
      const firstName = searchWords[0]; 
      const lastName = searchWords[0];
      if (searchWords.length >= 2) {
        const lastName = searchWords[1];  
      }

      this.userService.searchForUser(firstName, lastName)
        .subscribe(
          (response: any) => {
            console.log('Search Results:', response);
            this.onListUsersUpdate.emit(response);
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
