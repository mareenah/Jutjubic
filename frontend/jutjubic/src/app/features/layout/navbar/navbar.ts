import { Component, ElementRef, HostListener, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../../models/user.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { VideoCreateComponent } from '../../stakeholder/video-create/video-create';
import { UserProfile } from '../../../models/userProfile.model';
import { StakeholderService } from '../../stakeholder/stakeholder.service';
import { WatchPartyResponse } from '../../../models/watchPartyResponse.model';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [MatIconModule, CommonModule, MatDialogModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar implements OnInit {
  user: User | undefined;
  isLoginPage = false;
  isRegisterPage = false;
  isHomePage = false;
  isWatchPartyPage = false;
  isWatchPartiesPage = false;
  dropdownOpen = false;
  dialog = inject(MatDialog);
  isLoggedIn: boolean = false;
  isWatchPartyCreator: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private stakeholderService: StakeholderService,
    private elementRef: ElementRef,
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });

    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      if (this.isLoggedIn) this.isCreator(this.user!);
    });

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      const url = this.router.url;
      this.isLoginPage = url === '/login';
      this.isRegisterPage = url === '/register';
      this.isHomePage = url === '/';
      this.isWatchPartyPage = url.startsWith('/watch-party/');
      this.isWatchPartiesPage = url === '/watch-parties';
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

  profile(user: User): void {
    this.router.navigate(['/users', user.id]);
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

  create(): void {
    this.dialog.open(VideoCreateComponent, {
      height: '87vh',
      width: '65vw',
      maxWidth: '100vw',
      maxHeight: '100vh',
    });
  }

  createWatchParty(): void {
    this.router.navigate(['/watch-party']);
  }

  isCreator(user: User): void {
    this.stakeholderService.isCreator(user.id!).subscribe({
      next: (result) => {
        this.isWatchPartyCreator = result;
      },
      error: () => {
        console.log(console.error);
      },
    });
  }

  displayWatchParties(): void {
    this.router.navigate(['/watch-parties']);
  }
}
