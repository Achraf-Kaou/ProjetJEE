import { Ride } from "./Ride";
import { User } from "./User";

export interface Review {
    id?: Object;
    ride: Ride;
    reviewer: User | null;
    reviewed: User | null;
    dateReview: Date | null;
    review: number;
    comment: String;
}
