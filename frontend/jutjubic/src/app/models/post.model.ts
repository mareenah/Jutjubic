import { UserProfile } from './userProfile.model';

export interface PostResponse {
  title: string;
  description: string;
  tags: string[];
  thumbnail: string;
  video: string;
  country?: string;
  city?: string;
  user: UserProfile;
}
