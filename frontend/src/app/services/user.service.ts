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
}
