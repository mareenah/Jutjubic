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
import { AuthenticationResponse } from '../models/authenticationResponse.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = new BehaviorSubject<User>({
    username: '',
    id: 0,
  });
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedInSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorage,
    private router: Router
  ) {
    this.restoreUserFromToken();
  }

  register(registration: Registration): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(
      environment.apiHost + 'auth/register',
      registration
    );
  }

  verify(code: String): Observable<Boolean> {
    return this.http.get<Boolean>(environment.apiHost + 'auth/verify?verificationCode=' + code);
  }

  login(login: Login): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(environment.apiHost + 'auth/login', login).pipe(
      tap((authenticationResponse) => {
        this.tokenStorage.saveAccessToken(authenticationResponse.accessToken);
        this.setUser();
        this.loggedInSubject.next(true);
      })
    );
  }

  private setUser(): void {
    const jwtHelperService = new JwtHelperService();
    const accessToken = this.tokenStorage.getAccessToken() || '';
    const user: User = {
      id: +jwtHelperService.decodeToken(accessToken).id,
      username: jwtHelperService.decodeToken(accessToken).username,
    };

    this.user$.next(user);
  }

  private restoreUserFromToken(): void {
    if (this.tokenStorage.getAccessToken()) {
      this.setUser();
      this.loggedInSubject.next(true);
    }
  }

  logout(): void {
    this.tokenStorage.clear();
    this.router.navigate(['']);
    this.user$.next({ username: '', id: 0 });
    this.loggedInSubject.next(false);
  }
}
