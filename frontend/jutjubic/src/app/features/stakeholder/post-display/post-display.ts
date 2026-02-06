import { Component, OnInit } from '@angular/core';
import { PostResponse } from '../../../models/postResponse.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StakeholderService } from '../stakeholder.service';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { UserProfile } from '../../../models/userProfile.model';
import { Observable } from 'rxjs';
import { Comment } from '../../../models/comment.model';
import { C } from '@angular/cdk/keycodes';

@Component({
  standalone: true,
  selector: 'app-post-display',
  imports: [CommonModule, MatIcon],
  templateUrl: './post-display.html',
  styleUrl: './post-display.css',
})
export class PostDisplayComponent implements OnInit {
  post!: PostResponse;
  isLoggedIn = false;
  user: User | undefined;
  videoUrl!: string;
  post$!: Observable<PostResponse>;
  comment: Comment = {
    text: '',
    postId: '',
    userId: '',
  };
  postId: string = '';

  constructor(
    private router: Router,
    private stakeholderService: StakeholderService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });

    this.isLoggedIn = !!this.user?.id;

    this.postId = this.route.snapshot.paramMap.get('id')!;
    if (!this.postId) {
      console.error('Ne postoji id u objavi');
      return;
    }

    this.post$ = this.stakeholderService.findPostByIdWithVideo(this.postId);
  }

  tryLike() {
    if (!this.isLoggedIn) {
      alert('Da bi lajkovao objavu, prijavi se.');
      return;
    }
  }

  async tryComment(typedText: string) {
    if (!this.isLoggedIn) {
      alert('Da bi komentarisao objavu, prijavi se.');
      return;
    }

    if (!typedText.trim()) {
      alert('Komentar ne može biti prazan!');
      return;
    }

    const comment: Comment = { text: typedText, postId: this.postId, userId: this.user?.id! };
    try {
      const response = await this.stakeholderService.createComment(comment);
      console.log('Comment created:', response);
      //this.commentText = '';
    } catch (err) {
      console.error('Error creating comment', err);
    }
  }

  displayProfile(user: UserProfile): void {
    this.router.navigate(['/users', user.id]);
  }
}
