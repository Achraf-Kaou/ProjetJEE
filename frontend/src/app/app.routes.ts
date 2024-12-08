import { Routes } from '@angular/router';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { RideListComponent } from './components/ride-list/ride-list.component';
import { ReviewComponent } from './components/review/review.component';
import { RideHistoryComponent } from './components/ride-history/ride-history.component';
import { ReservationHistoryComponent } from './components/reservation-history/reservation-history.component';
import { ProfilComponent } from './pages/profil/profil.component';

export const routes: Routes = [
    { path: 'signIn', component: SignInComponent },
    { path: 'signUp', component: SignUpComponent },
    { path: 'home', component: HomeComponent },
    { path: 'profil/:id', component: ProfilComponent },
    { path: 'nav', component: NavbarComponent },
    { path: 'footer', component: FooterComponent },
    { path: 'rides', component: RideListComponent },
    { path: 'review', component: ReviewComponent },
    { path: 'rideshistory', component: RideHistoryComponent },
    { path: 'reservationhistory', component: ReservationHistoryComponent },


];
