import { Post } from './post.model';
import { UserProfile } from './userProfile.model';

export interface CommentResponse {
  id?: string;
  text: string;
  createdAt: string;
  post: Post;
  user: UserProfile;
}
