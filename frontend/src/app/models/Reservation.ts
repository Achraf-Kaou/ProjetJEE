import { Ride } from "./Ride";
import { User } from "./User";

export interface Reservation {
    idReservation?: Object;
    ride: Ride;
    passenger: User;
    dateReservation: Date;
    status: string;
}
