import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StakeholderService } from '../stakeholder.service';
import { WatchPartyResponse } from '../../../models/watchPartyResponse.model';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../../models/user.model';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-watch-party-display',
  imports: [MatIconModule, MatChipsModule, CommonModule],
  templateUrl: './watch-party-display.html',
  styleUrl: './watch-party-display.css',
})
export class WatchPartyDisplayComponent implements OnInit {
  watchPartyId: string = '';
  watchParty: WatchPartyResponse = {
    id: '',
    creatorId: '',
    members: [],
    post: {
      id: '',
      title: '',
      description: '',
      tags: [],
      thumbnail: '',
      video: '',
      createdAt: '',
      country: undefined,
      city: undefined,
      user: {
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
      },
      views: 0,
    },
  };
  user: User | undefined;
  postId: string = '';

  constructor(
    private stakeholderService: StakeholderService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });

    this.postId = this.route.snapshot.paramMap.get('postId')!;
    if (!this.postId) {
      console.error('Ne postoji postId u objavi.');
      return;
    }

    this.watchPartyId = this.route.snapshot.paramMap.get('id')!;
    if (!this.watchPartyId) {
      console.error('Ne postoji id watch party-ja!');
      return;
    }

    this.findWatchParty();
  }

  findWatchParty(): void {
    this.stakeholderService.findWatchPartyById(this.watchPartyId).subscribe({
      next: (party) => {
        party.post = this.stakeholderService.mapPostVideo(party.post);
        this.watchParty = party;
        this.cdr.detectChanges();
      },
    });
  }
}
