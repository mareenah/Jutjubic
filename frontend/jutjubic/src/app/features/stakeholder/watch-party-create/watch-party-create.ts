import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../auth/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { StakeholderService } from '../stakeholder.service';
import { PostResponse } from '../../../models/postResponse.model';
import { ChangeDetectorRef } from '@angular/core';
import { UserProfile } from '../../../models/userProfile.model';
import { Router } from '@angular/router';
import { WatchParty } from '../../../models/watchParty.model';

@Component({
  standalone: true,
  selector: 'app-watch-party-create',
  imports: [MatInputModule, MatButtonModule, MatCardModule, CommonModule, MatCheckboxModule],
  templateUrl: './watch-party-create.html',
  styleUrl: './watch-party-create.css',
})
export class WatchPartyCreateComponent implements OnInit {
  user: User | undefined;
  isLoggedIn: boolean = false;
  availablePosts: PostResponse[] = [];
  availableUsers: UserProfile[] = [];
  selectedUsers: UserProfile[] = [];
  selectedPost: PostResponse | null = null;
  submitted = false;

  constructor(
    private stakeholderService: StakeholderService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });

    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });

    this.findUsers();
    this.findPosts();
  }

  findPosts(): void {
    this.stakeholderService.findPosts().subscribe({
      next: (result) => {
        this.availablePosts = result;
        console.log('findPosts' + this.availablePosts);
        this.cdr.detectChanges();
      },
      error: () => {
        console.log(console.error);
      },
    });
  }

  findUsers(): void {
    this.authService.findUsers().subscribe({
      next: (result) => {
        this.availableUsers = result.filter((user) => user.id !== this.user?.id);
        this.cdr.detectChanges();
      },
      error: () => {
        console.log(console.error);
      },
    });
  }

  sendInvites(): void {
    this.submitted = true;
    if (!this.selectedPost || !this.user || this.selectedUsers.length === 0) {
      alert('Izaberi učesnike i video objavu.');
      return;
    }

    const watchParty: WatchParty = {
      creatorId: this.user.id!,
      memberIds: this.selectedUsers.map((u) => u.id).filter((id): id is string => !!id),
      postId: this.selectedPost.id!,
    };

    this.stakeholderService.createWatchParty(watchParty).subscribe({
      next: (room) => {
        alert('Uspješno kreiran watch party!');
        this.router.navigate(['/watchParty', room.id]);
      },
      error: () => {
        console.error('Failed to create watch party');
        console.log(console.error);
      },
    });
  }

  toggleUser(user: UserProfile, checked: boolean): void {
    if (checked) {
      this.selectedUsers.push(user);
    } else {
      this.selectedUsers = this.selectedUsers.filter((u) => u.id !== user.id);
    }
  }

  selectPost(post: PostResponse): void {
    this.selectedPost = post;
  }
}
