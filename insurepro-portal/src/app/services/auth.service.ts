import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { LoginRequest } from '../models/login-request';
import {  BehaviorSubject,Observable,tap } from 'rxjs';
import { LoginResponse } from '../models/login-response';
import { AuthStateServiceService } from './auth-state-service.service';

@Service()
export class AuthService {
  private http = inject(HttpClient);
  private authState = inject(AuthStateServiceService);
  private apiUrl = 'http://localhost:5206/api/Auth';
  public isRefreshing = false;
  public refreshTokenSubject = new BehaviorSubject<string | null>(null);


  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request, {
      withCredentials: true,
    });
  }

refreshToken(): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(`${this.apiUrl}/refresh`,{},{withCredentials: true})
   .pipe(tap(response => {
      sessionStorage.setItem('token',response.accessToken);
      sessionStorage.setItem('role',response.role);
    })

  );
}

  saveUserData(logInRes: LoginResponse) {
    sessionStorage.setItem('token', logInRes.accessToken);
    sessionStorage.setItem('role', logInRes.role);
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }
  getRoleName(): string | null {
    return sessionStorage.getItem('role');
  }

  logOut() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
  }

  isLogedIn(): boolean {
    return !!this.getToken();
  }

  initializeAuth(): Observable<LoginResponse> {

    return this.refreshToken()
      .pipe(

        tap(response => {

          this.authState.setUser(
            response.role,
            response.role
          );

        })

      );

  }


}
