export interface Post {
  title: string;
  slug: string;
  date: string; // ISO date string
  cover?: typeof Image;
  video?: string | typeof File; // string public path or richer FileField
  metadata: { readingTime: number; wordCount: number };
  excerpt?: string;
  content: any; // HTML
  // computed by velite transform in velite.config.ts
  permalink: string;
}
