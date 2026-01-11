import { Component, OnInit } from '@angular/core';
import { Post } from '../../../models/post.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PostService } from '../post.service';
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

  constructor(private router: Router, private postService: PostService) {}

  ngOnInit() {
    this.postService.selectedPost$.subscribe((p) => {
      if (p) this.post = p;
      else console.error('Izaberi objavu!');
    });
    console.log(this.post);
  }

  tryLike() {
    if (!this.isLoggedIn) {
      alert('Da bi lajkovao objavu, prijavi se.');
      return;
    }
    // like logic
  }

  tryComment() {
    if (!this.isLoggedIn) {
      alert('Da bi komentarisao objavu, prijavi se.');
      return;
    }
    // comment logic
  }

  displayProfile(userId: string): void {
    this.router.navigate(['/users', userId]);
  }
}
