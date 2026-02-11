import { PostResponse } from './postResponse.model';
import { UserProfile } from './userProfile.model';

export interface WatchPartyResponse {
  id: string;
  creator: UserProfile;
  members: UserProfile[];
  post: PostResponse;
}
