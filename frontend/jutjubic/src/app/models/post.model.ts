import { UserProfile } from './userProfile.model';

export interface Post {
  title: string;
  description: string;
  tags: string[];
  thumbnail: string;
  video: string;
  country?: string;
  city?: string;
}
