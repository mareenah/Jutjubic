import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs';
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
export class Navbar implements OnInit, AfterViewInit {
  user: User | undefined;
  isLoginPage = false;
  isRegisterPage = false;
  isLoggedIn = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private tokenStorage: TokenStorage
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.user = user;
      console.log('Navbar\n' + 'username: ' + user.username + ' id: ' + user.id);
    });
  }

  ngAfterViewInit(): void {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.isLoginPage = this.router.url === '/login';
      this.isRegisterPage = this.router.url === '/register';
    });
  }

  hasLoggedIn(): boolean {
    return this.user?.username !== '';
  }

  login(): void {
    this.router.navigate(['/login']);
  }
}
