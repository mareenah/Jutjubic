import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { UserProfile } from '../../../models/userProfile.model';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { Post } from '../../../models/post.model';
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
  posts: Post[] = [
    {
      id: 1,
      title: 'How to survive isa in 2k26',
      description: 'Vlogging in Novi Sad while sprinkling truths',
      tags: ['college', 'vlog'],
      thumbnail: 'assets/pic10.jpg',
      video: 'assets/video1.mp4',
      createdAt: '2025-01-11',
      geoLocation: 'Novi Sad, Serbia',
      userId: '558cce57-fa1d-45d0-b78c-c78a45e0ac49',
    },
    {
      id: 2,
      title: 'Glowup 2k26',
      description: 'GO GIRL',
      tags: ['support', 'girls'],
      thumbnail: 'assets/pic7.jpg',
      video: 'assets/video2.mp4',
      createdAt: '2025-01-01',
      geoLocation: 'Belgrade',
      userId: 'dd218417-7c74-4862-a561-ea2e912237b4',
    },
    {
      id: 3,
      title: 'Narcissistic people??',
      description: 'Psychology in life',
      tags: ['psychology', 'narcissistic', 'treatment'],
      thumbnail: 'assets/pic3.jpg',
      video: 'assets/video3.mp4',
      createdAt: '2025-01-13',
      geoLocation: 'Boston',
      userId: 'dd218417-7c74-4862-a561-ea2e912237b4',
    },
    {
      id: 4,
      title: 'Travel Vlog',
      description: 'Trip to Italy',
      tags: ['travel', 'vlog'],
      thumbnail: 'assets/pic6.jpg',
      video: 'assets/video1.mp4',
      createdAt: '2025-01-10',
      geoLocation: 'Rome, Italy',
      userId: '558cce57-fa1d-45d0-b78c-c78a45e0ac49',
    },
    {
      id: 5,
      title: 'Music Cover',
      description: 'Acoustic guitar',
      tags: ['music'],
      thumbnail: 'assets/pic1.jpg',
      video: 'assets/video2.mp4',
      createdAt: '2025-01-11',
      geoLocation: 'Belgrade',
      userId: 'f93a58de-807b-4d0b-ae2e-dba507196f31',
    },
    {
      id: 6,
      title: 'Workout',
      description: 'Home training',
      tags: ['fitness'],
      thumbnail: 'assets/pic11.jpg',
      video: 'assets/video3.mp4',
      createdAt: '2025-01-12',
      geoLocation: 'Novi Sad',
      userId: '558cce57-fa1d-45d0-b78c-c78a45e0ac49',
    },
    {
      id: 7,
      title: 'What is PDA?',
      description: 'Easy followup tutorial',
      tags: ['affection', 'public', 'street'],
      thumbnail: 'assets/pic8.jpg',
      video: 'assets/video4.mp4',
      createdAt: '2025-01-13',
      geoLocation: 'France',
      userId: 'f93a58de-807b-4d0b-ae2e-dba507196f31',
    },
    {
      id: 8,
      title: 'Gaming Highlights',
      description: 'Best moments',
      tags: ['gaming'],
      thumbnail: 'assets/pic13.jpg',
      video: 'assets/video5.mp4',
      createdAt: '2025-01-14',
      geoLocation: 'Online',
      userId: '558cce57-fa1d-45d0-b78c-c78a45e0ac49',
    },
    {
      id: 9,
      title: 'Makeup Tutorial',
      description: 'Evening look',
      tags: ['beauty'],
      thumbnail: 'assets/pic5.jpg',
      video: 'assets/video6.mp4',
      createdAt: '2025-01-15',
      geoLocation: 'Paris',
      userId: 'dd218417-7c74-4862-a561-ea2e912237b4',
    },
    {
      id: 10,
      title: 'Tech Review',
      description: 'New phone',
      tags: ['tech'],
      thumbnail: 'assets/pic9.jpg',
      video: 'assets/video7.mp4',
      createdAt: '2025-01-16',
      geoLocation: 'Berlin',
      userId: 'f93a58de-807b-4d0b-ae2e-dba507196f31',
    },
    {
      id: 11,
      title: 'Study With Me',
      description: 'Focus session',
      tags: ['study', 'focus'],
      thumbnail: 'assets/pic2.jpg',
      video: 'assets/video8.mp4',
      createdAt: '2025-01-17',
      geoLocation: 'Home',
      userId: 'dd218417-7c74-4862-a561-ea2e912237b4',
    },
    {
      id: 12,
      title: 'Daily Routine',
      description: 'Morning habits',
      tags: ['lifestyle'],
      thumbnail: 'assets/pic12.jpg',
      video: 'assets/video9.mp4',
      createdAt: '2025-01-18',
      geoLocation: 'Zagreb',
      userId: 'dd218417-7c74-4862-a561-ea2e912237b4',
    },
  ];

  userPosts: Post[] = [];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private stakeholderService: StakeholderService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.userId = params['userId'];
      this.filterPosts();
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

  filterPosts(): void {
    this.userPosts = this.posts.filter((post) => post.userId === this.userId);
  }

  displayPost(post: Post): void {
    this.stakeholderService.selectPost(post);
    this.router.navigate(['/posts', post.id]);
  }
}
