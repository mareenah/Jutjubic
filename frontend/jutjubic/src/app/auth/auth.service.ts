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
import { UserProfile } from '../models/userProfile.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = new BehaviorSubject<User>({
    username: '',
    id: '',
  });

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorage,
    private router: Router,
  ) {
    this.restoreUserFromToken();
  }

  register(registration: Registration): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(
      environment.apiHost + 'auth/register',
      registration,
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
      }),
    );
  }

  private setUser(): void {
    const jwtHelperService = new JwtHelperService();
    const accessToken = this.tokenStorage.getAccessToken() || '';
    const decode = jwtHelperService.decodeToken(accessToken);

    const user: User = {
      id: decode.id,
      username: decode.username,
    };

    this.user$.next(user);
  }

  private restoreUserFromToken(): void {
    const token = this.tokenStorage.getAccessToken();
    const jwtHelper = new JwtHelperService();

    if (jwtHelper.isTokenExpired(token)) {
      this.logout();
      this.router.navigate(['/login']);
      return;
    }

    this.setUser();
  }

  logout(): void {
    this.tokenStorage.clear();
    this.router.navigate(['']);
    this.user$.next({ username: '', id: '' });
  }

  isLoggedIn(): boolean {
    return !!this.tokenStorage.getAccessToken();
  }

  getUserProfile(id: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(environment.apiHost + 'auth/user/' + id);
  }
}
