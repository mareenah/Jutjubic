export interface Post {
  id: number;
  title: string;
  description: string;
  tags: string[];
  thumbnail: string;
  video: string;
  createdAt: string;
  geoLocation?: string;
  userId: number;
}
