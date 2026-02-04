import { UserProfile } from './userProfile.model';

export interface Post {
  title: string;
  description: string;
  tags: string[];
  thumbnail: File;
  video: File;
  country?: string;
  city?: string;
}
