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
  addReservation(idPassanger: Object | undefined, idRide: Object | undefined): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addReservation/${idPassanger?.toString()}/${idRide?.toString()}`,{})
  }
  cancelReservation(id: Object | undefined ): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/cancelReservation/${id?.toString()}`,{})
  }
  getAllReservationByUser(id : Object | undefined): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/getAllReservationByUser/${id?.toString()}`)
  }
  getAllReservationByRide(id : Object | undefined): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/getAllReservationByRide/${id?.toString()}`)
  }
  getAllReservationByRideAndStatus(id : string , status : string): Observable<any>{
    const params = new HttpParams()
      .set('status', status)
    return this.http.get<any>(`${this.apiUrl}/getAllReservationByRideAndStatus/${id}?${params.toString()}`)
  }
  getReservationByPassangerAndRide(idPassanger: Object | undefined, idRide: Object | undefined): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getReservationByPassangerAndRide/${idPassanger?.toString()}/${idRide?.toString()}`)
  }
  
}
