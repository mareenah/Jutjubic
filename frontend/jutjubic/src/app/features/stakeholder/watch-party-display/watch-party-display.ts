import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StakeholderService } from '../stakeholder.service';
import { WatchPartyResponse } from '../../../models/watchPartyResponse.model';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../../models/user.model';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { SocketService } from '../socket.service';
import { filter } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-watch-party-display',
  imports: [MatIconModule, MatChipsModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './watch-party-display.html',
  styleUrl: './watch-party-display.css',
})
export class WatchPartyDisplayComponent implements OnInit {
  watchPartyId: string = '';
  watchParty: WatchPartyResponse = {
    id: '',
    creator: {
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
  isCreator: boolean = false;
  isLoggedIn: boolean = false;
  videoStarted = false;
  videoUrl: string = '';

  constructor(
    private stakeholderService: StakeholderService,
    private authService: AuthService,
    private socketService: SocketService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
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

    this.socketService.connect(() => {
      this.socketService.subscribeToWatchParty(this.watchPartyId, (event) =>
        this.handleSocketEvent(event),
      );
    });

    this.authService.user$.pipe(filter((user): user is User => !!user)).subscribe((user) => {
      this.user = user;
      this.findWatchParty();
      this.checkIfCreator();
    });
  }

  handleSocketEvent(event: any) {
    if (event.type === 'VIDEO_STARTED') {
      this.videoStarted = true;
      this.watchParty.post.video = this.stakeholderService.streamVideoUrl(
        this.watchParty.post.video,
      );

      this.cdr.detectChanges();
    }
  }

  findWatchParty(): void {
    this.stakeholderService.findWatchPartyById(this.watchPartyId).subscribe({
      next: (party) => {
        this.watchParty = party;
        this.cdr.detectChanges();
      },
    });
  }

  checkIfCreator() {
    this.stakeholderService.isCreator(this.user!.id!).subscribe({
      next: (isCreator) => {
        this.isCreator = isCreator;
        this.cdr.detectChanges();
      },
    });
  }

  startParty() {
    this.socketService.startVideo(this.watchPartyId, this.watchParty.post.id);
  }
}
