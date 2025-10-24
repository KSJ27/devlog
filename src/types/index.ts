type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  tags: string[];
  publishedAt: string; // ISO
  readingTime: number; // 분
  likes: number;
  comments: number;
  content?: string;
};

export type { Post };
