import { Injectable } from '@angular/core';
import { Registration } from '../models/registration.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { RegistrationResponse } from '../models/registrationResponse.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environment/environment';
import { Login } from '../models/login.model';
import { User } from '../models/user.model';
import { TokenStorage } from './jwt/token.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = new BehaviorSubject<User>({
    username: '',
    id: 0,
  });

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorage,
    private router: Router
  ) {}

  register(registration: Registration): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(
      environment.apiHost + 'auth/customer/register',
      registration
    );
  }

  login(login: Login): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(environment.apiHost + 'auth/login', login).pipe(
      tap((authenticationResponse) => {
        this.tokenStorage.saveAccessToken(authenticationResponse.accessToken);
        this.setUser();
      })
    );
  }
}
