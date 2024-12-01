import { Routes } from '@angular/router';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';

export const routes: Routes = [
    { path: 'signIn', component: SignInComponent },
    { path: 'signUp', component: SignUpComponent },
    { path: 'home', component: HomeComponent },
    { path: 'nav', component: NavbarComponent },
];
