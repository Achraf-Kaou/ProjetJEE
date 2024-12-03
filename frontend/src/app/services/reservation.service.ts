import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reservation } from '../models/Reservation';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private apiUrl = 'http://localhost:8080/reservation';
  constructor(private http: HttpClient) {} 
  addReservation(reservation: Reservation ): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addReservation`, reservation, {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })})
  }
  canceReservation(id: string ): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/canceReservation/${id}`,{})
  }
  getAllReservationByUser(id : Object | undefined): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/getAllReservationByUser/${id}`)
  }
  getAllReservationByRide(id : Object | undefined): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/getAllReservationByRide/${id}`)
  }
  getAllReservationByRideAndStatus(id : string , status : string): Observable<any>{
    const params = new HttpParams()
      .set('status', status)
    return this.http.get<any>(`${this.apiUrl}/getAllReservationByRideAndStatus/${id}?${params.toString()}`)
  }
  getAllReservationByPassangerAndRide(idPassanger: string, idRide: String): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getAllReservationByPassangerAndRide/${idPassanger}/${idRide}`)
  }
}
