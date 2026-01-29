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

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [MatInputModule, MatCardModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit {
  userId!: string;
  user: UserProfile = {
    id: 0,
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
    this.getProfile();
  }

  getProfile(): void {
    this.authService.getUserProfile(this.userId).subscribe({
      next: (result) => {
        this.user = result;
        this.cdr.detectChanges();
      },
      error: () => {
        console.log(console.error);
      },
    });
  }

  displayPost(post: PostResponse): void {
    this.stakeholderService.selectPost(post);
    this.router.navigate(['/posts', post.id]);
  }
}
