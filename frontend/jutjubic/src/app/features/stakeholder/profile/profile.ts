import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { UserProfile } from '../../../models/userProfile.model';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { PostResponse } from '../../../models/postResponse.model';
import { CommonModule } from '@angular/common';
import { StakeholderService } from '../stakeholder.service';
import { ChangeDetectorRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [MatInputModule, MatCardModule, CommonModule, MatIconModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit {
  userId!: string;
  user: UserProfile = {
    id: '',
    email: '',
    username: '',
    password: '',
    name: '',
    lastname: '',
    enabled: false,
    address: {
      id: 0,
      country: '',
      city: '',
      street: '',
    },
  };
  posts: PostResponse[] = [];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private stakeholderService: StakeholderService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.userId = params['userId'];
    });
    this.findProfile();
  }

  findProfile(): void {
    this.authService.findUserProfile(this.userId).subscribe({
      next: (result) => {
        this.user = result;
        this.findPostsByUser(this.user);

        this.cdr.detectChanges();
      },
      error: () => {
        console.log(console.error);
      },
    });
  }

  findPostsByUser(user: UserProfile) {
    this.stakeholderService.findPostsByUser(this.user).subscribe({
      next: (result) => {
        this.posts = result;
        console.log('findPostsByUser' + this.posts + ' user:' + this.user.id);
        this.cdr.detectChanges();
      },
      error: () => {
        console.log(console.error);
      },
    });
  }

  displayPost(post: PostResponse): void {
    this.router.navigate(['/posts', post.id]);
  }
}
