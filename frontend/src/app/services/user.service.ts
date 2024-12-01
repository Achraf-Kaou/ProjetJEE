import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/user';
  constructor(private http: HttpClient) {} 
  login(email: string, password: string ): Observable<any> {
    const params = new HttpParams()
      .set('email', email)
      .set('password', password);
    const urlWithParams = `${this.apiUrl}/signIn?${params.toString()}`;

      // Effectuer la requête POST avec les paramètres dans l'URL
      return this.http.post<any>(urlWithParams, {});
  }
  register(user: User ): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/signUp`, user, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })})
  }
  updateUser(user: User ): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updateUser`, user, {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })})
  }
  deleteUser(id : string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deleteUser/${id}`);
  }
  getUserById(id : string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getUserById/${id}`);
  }
  searchForUser(firstName : string , lastName : string): Observable<any> {
    const params = new HttpParams()
      .set('firstName', firstName)
      .set('lastName', lastName);
    return this.http.get<any>(`${this.apiUrl}/getUserByName`,{params});
  }
  
}
