import { User } from "./User";

export interface Ride {
    id?: Object;
    depart: string;
    destination: string;
    places: number;
    price: number; 
    dateRide: Date; 
    description: string;
    driver: User;
}
