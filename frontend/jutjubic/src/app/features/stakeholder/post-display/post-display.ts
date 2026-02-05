import { Component, OnInit } from '@angular/core';
import { PostResponse } from '../../../models/postResponse.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StakeholderService } from '../stakeholder.service';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../../models/user.model';
import { UserProfile } from '../../../models/userProfile.model';

@Component({
  standalone: true,
  selector: 'app-post-display',
  imports: [CommonModule, MatIcon],
  templateUrl: './post-display.html',
  styleUrl: './post-display.css',
})
export class PostDisplayComponent implements OnInit {
  post!: PostResponse;
  isLoggedIn = false;
  user: User | undefined;

  constructor(
    private router: Router,
    private stakeholderService: StakeholderService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });

    if (this.user?.id !== '') this.isLoggedIn = true;

    this.stakeholderService.selectedPost$.subscribe((p) => {
      if (p) this.post = p;
      else console.error('Izaberi objavu!');
    });
  }

  tryLike() {
    if (!this.isLoggedIn) {
      alert('Da bi lajkovao objavu, prijavi se.');
      return;
    }
  }

  tryComment() {
    if (!this.isLoggedIn) {
      alert('Da bi komentarisao objavu, prijavi se.');
      return;
    }
  }

  displayProfile(user: UserProfile): void {
    this.router.navigate(['/users', user.id]);
  }
}
