import { Component, OnInit } from '@angular/core';
import { PostResponse } from '../../../models/postResponse.model';
import { CommonModule } from '@angular/common';
import { StakeholderService } from '../stakeholder.service';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfile } from '../../../models/userProfile.model';
import { Observable } from 'rxjs';
import { Comment } from '../../../models/comment.model';
import { FormsModule } from '@angular/forms';
import { CommentResponse } from '../../../models/commentResponse.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-post-display',
  imports: [CommonModule, MatIcon, FormsModule],
  templateUrl: './post-display.html',
  styleUrl: './post-display.css',
})
export class PostDisplayComponent implements OnInit {
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
  commentText: string = '';
  comments: CommentResponse[] = [];

  constructor(
    private stakeholderService: StakeholderService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
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
    await this.findComments();
    this.cdr.detectChanges();
  }

  tryLike() {
    if (!this.isLoggedIn) {
      alert('Da bi lajkovao objavu, prijavi se.');
      return;
    }
  }

  async tryComment() {
    if (!this.isLoggedIn) {
      alert('Da bi komentarisao objavu, prijavi se.');
      this.commentText = '';
      return;
    }

    if (!this.commentText.trim()) {
      alert('Komentar ne može biti prazan!');
      return;
    }

    console.log(this.commentText.trim().length);

    if (this.commentText.trim().length > 500) {
      alert('Komentar može imati najviše 500 karaktera!');
      return;
    }

    const comment: Comment = {
      text: this.commentText,
      postId: this.postId,
      userId: this.user?.id!,
    };

    this.commentText = '';

    try {
      const createdComment = await this.stakeholderService.createComment(comment);
      alert('Komentar kreiran!');
      this.comments = [createdComment, ...this.comments];
      this.cdr.detectChanges();
    } catch (err) {
      console.error('Greska u kreiranju komentara.', err);
      this.commentText = this.commentText;
    }
  }

  displayProfile(user: UserProfile): void {
    this.router.navigate(['/users', user.id]);
  }

  async findComments() {
    try {
      console.log('Loading comments...');
      this.comments = await this.stakeholderService.findCommentsByPost(this.postId);
      console.log('Comments found:', this.comments);

      if (!this.comments || this.comments.length === 0) {
        console.log('No comments found for this post');
      }
    } catch (err) {
      console.error('Failed to load comments', err);
    }
  }
}
