import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ride } from '../models/Ride';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RideService {

  private apiUrl = 'http://localhost:8080/ride';
  constructor(private http: HttpClient) {} 
  addRide(ride: Ride ): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addRide`, ride, {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })})
  }
  getAllRide(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/all`);
  }
  updateRide(ride : Ride ): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updateRide`, ride, {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })})
  }
  deleteRide(id : object | undefined): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deleteRide/${id}`);
  }
  updateRidePlaces(id : string , index : number): Observable<any> {
    const params = new HttpParams()
      .set('index', index)
    return this.http.delete<any>(`${this.apiUrl}/updateRidePlaces/${id}?${params.toString()}`);
  }
  getAllRideByUser(id : Object | undefined): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getAllRideByUser/${id?.toString()}`);
  }
  all(params: HttpParams ): Observable<any> {
    
    return this.http.get<any>(`${this.apiUrl}/all`,{ params });
  }


  terminateRides(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/terminateRides`);
  }

}
