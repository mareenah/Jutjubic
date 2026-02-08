import { Component, OnInit } from '@angular/core';
import { PostResponse } from '../../../models/postResponse.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StakeholderService } from '../stakeholder.service';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { UserProfile } from '../../../models/userProfile.model';
import { ChangeDetectorRef } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

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
  videoUrl!: string;
  post$!: Observable<PostResponse>;

  constructor(
    private router: Router,
    private stakeholderService: StakeholderService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });

    this.isLoggedIn = !!this.user?.id;

    const postId = this.route.snapshot.paramMap.get('id')!;
    if (!postId) {
      console.error('Ne postoji id u objavi');
      return;
    }

    this.post$ = this.stakeholderService.findPostByIdWithVideo(postId);
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
