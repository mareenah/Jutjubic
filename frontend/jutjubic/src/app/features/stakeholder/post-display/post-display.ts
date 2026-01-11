import { Component, OnInit } from '@angular/core';
import { Post } from '../../../models/post.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StakeholderService } from '../stakeholder.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-post-display',
  imports: [CommonModule, MatIcon],
  templateUrl: './post-display.html',
  styleUrl: './post-display.css',
})
export class PostDisplayComponent implements OnInit {
  post!: Post;
  isLoggedIn = false;

  constructor(private router: Router, private stakeholderService: StakeholderService) {}

  ngOnInit() {
    this.stakeholderService.selectedPost$.subscribe((p) => {
      if (p) this.post = p;
      else console.error('Izaberi objavu!');
    });
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

  displayProfile(userId: string): void {
    this.router.navigate(['/users', userId]);
  }
}
