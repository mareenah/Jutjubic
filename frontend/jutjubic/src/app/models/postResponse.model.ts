import { UserProfile } from './userProfile.model';

export interface PostResponse {
  id: number;
  title: string;
  description: string;
  tags: string[];
  thumbnail: string;
  video: string;
  createdAt: string;
  country?: string;
  city?: string;
  user: UserProfile;
}
