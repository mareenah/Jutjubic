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

@Component({
  standalone: true,
  selector: 'app-watch-parties-display',
  imports: [MatLabel, CommonModule, MatChipsModule],
  templateUrl: './watch-parties-display.html',
  styleUrl: './watch-parties-display.css',
})
export class WatchPartiesDisplayComponent implements OnInit {
  watchParties$!: Observable<WatchPartyResponse[]>;
  user: User | undefined;
  selectedParty: WatchPartyResponse | null = null;

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
      this.watchParties$ = this.stakeholderService.findWatchPartiesByCreator(this.user.id!);
  }
}
