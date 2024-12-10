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
  user!: User;
  users : User[] = []
  isSearchOpen = false; 
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
  onSearchFocus() {
    this.isSearchOpen = false; 
    this.searchControl.setValue(''); 
    this.users =[]; // Close the search results when the input is focused
  }
  onSearch() {
   
    const searchValue = this.searchControl.value;
  
  
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
            this.users = response;
            this.isSearchOpen = true;
          },
          (error: any) => {
            console.error('Search Error:', error);
            this.isSearchOpen = true;
          }
        );
    } else {
      console.warn('Search value is empty!');
    }
  }
  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/signIn']);
  }
  navigateToProfile(userId: string | undefined) {  
    this.router.navigate(['/profil', userId]);
    this.isSearchOpen = false;
    this.searchControl.setValue(''); 
    this.users =[];
  }
  
  
}
