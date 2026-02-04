import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PostResponse } from '../../models/postResponse.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class StakeholderService {
  private selectedPostSubject = new BehaviorSubject<PostResponse | null>(null);
  selectedPost$ = this.selectedPostSubject.asObservable();

  constructor(private http: HttpClient) {}

  selectPost(post: PostResponse) {
    this.selectedPostSubject.next(post);
  }

  uploadVideo(post: FormData): Observable<PostResponse> {
    return this.http.post<PostResponse>(environment.apiHost + 'posts/create', post);
  }

  findPosts(): Observable<PostResponse[]> {
    return this.http.get<PostResponse[]>(environment.apiHost + 'posts');
  }
}
