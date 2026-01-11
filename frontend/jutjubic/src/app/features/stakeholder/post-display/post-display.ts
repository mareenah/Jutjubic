import { Component, OnInit } from '@angular/core';
import { Post } from '../../../models/post.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StakeholderService } from '../stakeholder.service';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../../auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-post-display',
  imports: [CommonModule, MatIcon],
  templateUrl: './post-display.html',
  styleUrl: './post-display.css',
})
export class PostDisplayComponent implements OnInit {
  post!: Post;
  loggedIn$: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private stakeholderService: StakeholderService
  ) {}

  ngOnInit() {
    this.stakeholderService.selectedPost$.subscribe((p) => {
      if (p) this.post = p;
      else console.error('Izaberi objavu!');
    });
    this.loggedIn$ = this.authService.loggedIn$;
  }

  tryLike() {
    if (!this.loggedIn$) {
      alert('Da bi lajkovao objavu, prijavi se.');
      return;
    }
  }

  tryComment() {
    if (!this.loggedIn$) {
      alert('Da bi komentarisao objavu, prijavi se.');
      return;
    }
  }

  displayProfile(userId: string): void {
    this.router.navigate(['/users', userId]);
  }
}
