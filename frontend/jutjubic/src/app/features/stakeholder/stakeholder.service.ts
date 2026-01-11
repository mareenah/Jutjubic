import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Post } from '../../models/post.model';

@Injectable({ providedIn: 'root' })
export class StakeholderService {
  private selectedPostSubject = new BehaviorSubject<Post | null>(null);
  selectedPost$ = this.selectedPostSubject.asObservable();

  selectPost(post: Post) {
    this.selectedPostSubject.next(post);
  }
}
