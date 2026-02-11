import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, map, Observable } from 'rxjs';
import { PostResponse } from '../../models/postResponse.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { UserProfile } from '../../models/userProfile.model';
import { Comment } from '../../models/comment.model';
import { CommentResponse } from '../../models/commentResponse.model';
import { Page } from '../../models/page.model';
import { WatchParty } from '../../models/watchParty.model';
import { WatchPartyResponse } from '../../models/watchPartyResponse.model';

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

  async createComment(comment: Comment): Promise<CommentResponse> {
    return await firstValueFrom(
      this.http.post<CommentResponse>(environment.apiHost + 'comments/create', comment),
    );
  }

  async findCommentsByPost(
    postId: string,
    page: number,
    size: number,
  ): Promise<Page<CommentResponse>> {
    return await firstValueFrom(
      this.http.get<Page<CommentResponse>>(
        `${environment.apiHost}comments/post/${postId}?page=${page}&size=${size}`,
      ),
    );
  }

  createWatchParty(watchParty: WatchParty): Observable<WatchPartyResponse> {
    return this.http.post<WatchPartyResponse>(
      environment.apiHost + 'watch-party/create',
      watchParty,
    );
  }

  findWatchPartyById(id: string): Observable<WatchPartyResponse> {
    return this.http.get<WatchPartyResponse>(environment.apiHost + 'watch-party/' + id);
  }

  findWatchPartiesByCreator(creatorId: string): Observable<WatchPartyResponse[]> {
    return this.http.get<WatchPartyResponse[]>(
      environment.apiHost + 'watch-party/creator/' + creatorId,
    );
  }

  isCreator(creatorId: string): Observable<boolean> {
    return this.http.get<boolean>(environment.apiHost + 'watch-party/if-creator/' + creatorId);
  }

  isMember(userId: string): Observable<boolean> {
    return this.http.get<boolean>(environment.apiHost + 'watch-party/if-member/' + userId);
  }

  findWatchPartiesByMember(memberId: string): Observable<WatchPartyResponse[]> {
    return this.http.get<WatchPartyResponse[]>(
      environment.apiHost + 'watch-party/member/' + memberId,
    );
  }

  getCreatorByWatchPartyId(partyId: string) {
    return this.http.get<UserProfile>(`${environment.apiHost}watch-party/${partyId}/creator`);
  }
}
