import { Ride } from "./Ride";
import { User } from "./User";

export interface Review {
    id?: Object;
    ride: Ride;
    reviewer: User;
    reviewed: User;
    dateReview: Date;
    review: number;
    comment: String;
}
