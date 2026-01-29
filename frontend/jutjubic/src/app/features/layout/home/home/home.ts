import { Component, OnInit } from '@angular/core';
import { PostResponse } from '../../../../models/postResponse.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StakeholderService } from '../../../stakeholder/stakeholder.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  posts: PostResponse[] = [];

  constructor(
    private router: Router,
    private stakeholderService: StakeholderService,
  ) {}

  ngOnInit(): void {
    this.posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  displayPost(post: PostResponse): void {
    this.stakeholderService.selectPost(post);
    this.router.navigate(['/posts', post.id]);
  }
}
