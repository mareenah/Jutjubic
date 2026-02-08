import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { StakeholderService } from '../../../stakeholder/stakeholder.service';
import { PostResponse } from '../../../../models/postResponse.model';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  fixedPosts$!: Observable<PostResponse[]>;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private stakeholderService: StakeholderService,
  ) {}

  ngOnInit(): void {
    this.fixedPosts$ = this.stakeholderService.findPosts();
    this.cdr.detectChanges();
  }

  displayPost(post: PostResponse): void {
    this.router.navigate(['/posts', post.id]);
  }

  trackById(index: number, post: PostResponse) {
    return post.id;
  }
}
