import { Component, OnInit } from '@angular/core';
import { WatchPartyResponse } from '../../../models/watchPartyResponse.model';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../auth/auth.service';
import { StakeholderService } from '../stakeholder.service';
import { MatLabel } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserProfile } from '../../../models/userProfile.model';

@Component({
  standalone: true,
  selector: 'app-watch-party-join',
  imports: [MatLabel, CommonModule, MatChipsModule],
  templateUrl: './watch-party-join.html',
  styleUrl: './watch-party-join.css',
})
export class WatchPartyJoinComponent implements OnInit {
  watchParties$!: Observable<WatchPartyResponse[]>;
  user: User | undefined;
  selectedParty: WatchPartyResponse | null = null;
  creator?: UserProfile;
  creatorsMap: { [partyId: string]: UserProfile } = {};

  constructor(
    private authService: AuthService,
    private router: Router,
    private stakeholderService: StakeholderService,
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });

    if (this.user)
      this.watchParties$ = this.stakeholderService.findWatchPartiesByMember(this.user.id!);
  }

  selectParty(party: WatchPartyResponse): void {
    this.selectedParty = party;
    this.router.navigate([
      '/watch-party/' + this.selectedParty.id + '/' + this.selectedParty.post.id,
    ]);
    alert('Pridružio si se party-ju!');
  }
}
