import { PostResponse } from './postResponse.model';
import { UserProfile } from './userProfile.model';

export interface WatchPartyResponse {
  id: string;
  creatorId: string;
  members: UserProfile[];
  post: PostResponse;
}
