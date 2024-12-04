import { Routes } from '@angular/router';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { RideListComponent } from './components/ride-list/ride-list.component';
import { RideHistoryComponent } from './components/ride-history/ride-history.component';

export const routes: Routes = [
    { path: 'signIn', component: SignInComponent },
    { path: 'signUp', component: SignUpComponent },
    { path: 'home', component: HomeComponent },
    { path: 'nav', component: NavbarComponent },
    { path: 'footer', component: FooterComponent },
    { path: 'rides', component: RideListComponent },
    { path: 'rideshistory', component: RideHistoryComponent },

];
