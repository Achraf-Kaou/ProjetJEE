import { Ride } from "./Ride";
import { User } from "./User";

export interface Review {
    idReview?: Object;
    ride: Ride | null;
    reviewer: User | null;
    reviewed: User | null;
    dateReview: Date | null;
    review: number;
    comment: String;
}
