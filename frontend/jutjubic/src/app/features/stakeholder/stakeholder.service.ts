import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { PostResponse } from '../../models/postResponse.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { UserProfile } from '../../models/userProfile.model';

@Injectable({ providedIn: 'root' })
export class StakeholderService {
  private selectedPostSubject = new BehaviorSubject<PostResponse | null>(null);
  selectedPost$ = this.selectedPostSubject.asObservable();

  constructor(private http: HttpClient) {}

  uploadVideo(post: FormData): Observable<PostResponse> {
    return this.http.post<PostResponse>(environment.apiHost + 'posts/create', post);
  }

  findPosts(): Observable<PostResponse[]> {
    return this.http.get<PostResponse[]>(environment.apiHost + 'posts');
  }

  findPostById(id: string): Observable<PostResponse> {
    return this.http.get<PostResponse>(environment.apiHost + 'posts/' + id);
  }

  findPostsByUser(user: UserProfile): Observable<PostResponse[]> {
    return this.http.get<PostResponse[]>(environment.apiHost + 'posts/user/' + user.id);
  }

  findPostByIdWithVideo(id: string): Observable<PostResponse> {
    return this.http.get<PostResponse>(environment.apiHost + 'posts/' + id).pipe(
      map((post) => ({
        ...post,
        video: this.streamVideoUrl(post.video),
      })),
    );
  }

  streamVideoUrl(filename: string): string {
    return environment.apiHost + 'posts/videos/' + filename;
  }
}
