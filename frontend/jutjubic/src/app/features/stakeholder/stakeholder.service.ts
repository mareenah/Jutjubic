import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PostResponse } from '../../models/postResponse.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { Post } from '../../models/post.model';

@Injectable({ providedIn: 'root' })
export class StakeholderService {
  private selectedPostSubject = new BehaviorSubject<PostResponse | null>(null);
  selectedPost$ = this.selectedPostSubject.asObservable();

  constructor(private http: HttpClient) {}

  selectPost(post: PostResponse) {
    this.selectedPostSubject.next(post);
  }

  uploadVideo(videoData: FormData): Observable<Post> {
    return this.http.post<Post>(environment.apiHost + 'posts/create', videoData);
  }
}
