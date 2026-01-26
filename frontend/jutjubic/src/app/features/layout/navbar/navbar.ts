import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { filter, map, startWith } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../../models/user.model';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [MatIconModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar implements OnInit {
  user: User | undefined;
  isLoginPage = false;
  isRegisterPage = false;
  loggedIn$: any;
  isAuthPage$: any;
  dropdownOpen = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private elementRef: ElementRef,
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.user = user;
      console.log('Navbar\n' + 'username: ' + user.username + ' id: ' + user.id);
    });

    this.loggedIn$ = this.authService.loggedIn$;

    this.isAuthPage$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      map(() => {
        const url = this.router.url;
        return url === '/login' || url === '/register';
      }),
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
    this.dropdownOpen = false;
  }

  toggleMenu() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.dropdownOpen = false;
    }
  }

  home(): void {
    this.router.navigate(['/']);
  }
}
