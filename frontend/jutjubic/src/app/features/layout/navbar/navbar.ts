import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { filter, map, startWith } from 'rxjs';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../auth/auth.service';
import { TokenStorage } from '../../../auth/jwt/token.service';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [MatIconModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  isLoginPage = false;
  isRegisterPage = false;
  loggedIn$: any;
  isAuthPage$: any;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.loggedIn$ = this.authService.loggedIn$;

    this.isAuthPage$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      map(() => {
        const url = this.router.url;
        return url === '/login' || url === '/register';
      })
    );

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      const url = this.router.url;
      this.isLoginPage = url === '/login';
      this.isRegisterPage = url === '/register';
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
