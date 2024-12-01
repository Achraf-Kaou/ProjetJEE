import { Ride } from "./Ride";
import { User } from "./User";

export interface Reservation {
    id?: Object;
    ride: Ride;
    passenger: User;
    dateReservation: Date;
    status: number;
}
