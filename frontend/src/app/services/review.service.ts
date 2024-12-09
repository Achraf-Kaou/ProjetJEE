import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review } from '../models/Review';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private apiUrl = 'http://localhost:8080/review';
  constructor(private http: HttpClient) {} 
  addReview(Review: Review ): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addReview`, Review, {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })})
  }
  updateReview(review: Review  ): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updateReview`, review, {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })})
  }
  getMeanReviewByUser(id : object|undefined): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/getMeanReviewByUser/${id}`)
  }
  getMeanReviewByRide(id : object | undefined): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/getMeanReviewByRide/${id}`)
  }
  getAllReviewByRide(id : string): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/getAllReviewByRide/${id.toString()}`)
  }
  deleteReview(id : string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deleteReview/${id}`);
  }
  getNotReviewedRides(id : Object | undefined ): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getNotReviewedRides/${id?.toString()}`)
  }
  getNotReviewedPassengerByRide(idRide: Object | undefined): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getNotReviewedPassengerByRide/${idRide?.toString()}`)
  }
}
