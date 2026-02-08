import { Component, OnInit } from '@angular/core';
import { PostResponse } from '../../../models/postResponse.model';
import { CommonModule } from '@angular/common';
import { StakeholderService } from '../stakeholder.service';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfile } from '../../../models/userProfile.model';
import { Comment } from '../../../models/comment.model';
import { FormsModule } from '@angular/forms';
import { CommentResponse } from '../../../models/commentResponse.model';
import { ChangeDetectorRef } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Component({
  standalone: true,
  selector: 'app-post-display',
  imports: [CommonModule, MatIconModule, FormsModule],
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
  page: number = 0;
  size: number = 10;
  totalPages: number = 1;

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
    } catch (err: any) {
      if (err.status === 429) alert(err.error.message);
      else if (err.status === 401) alert(err.error.message);
      else console.error('Greška u kreiranju komentara.', err);
      this.commentText = this.commentText;
    }
    await this.findComments();
  }

  displayProfile(user: UserProfile): void {
    this.router.navigate(['/users', user.id]);
  }

  async findComments() {
    try {
      const pageResult = await this.stakeholderService.findCommentsByPost(
        this.postId,
        this.page,
        this.size,
      );

      this.comments = [...pageResult.content];
      this.totalPages = pageResult.totalPages;
      this.cdr.detectChanges();
    } catch (err) {
      console.error('Failed to load comments', err);
    }
  }

  async nextPage() {
    if (this.page + 1 < this.totalPages) {
      this.page++;
      await this.findComments();
    }
  }

  async prevPage() {
    if (this.page > 0) {
      this.page--;
      await this.findComments();
    }
  }
}
