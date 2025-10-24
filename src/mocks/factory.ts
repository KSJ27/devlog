import { faker } from "@faker-js/faker";
import type { Post } from "@/types";

function generatePost(overrides?: Partial<Post>): Post {
  const id = faker.string.uuid();
  const title = faker.lorem.sentence({ min: 4, max: 9 });
  const slug = faker.helpers.slugify(title.toLowerCase());
  const coverImage = null;
  // Math.random() > 0.3 ? `https://picsum.photos/seed/${slug}/1200/628` : null;
  const tags = faker.helpers.arrayElements(
    ["Next.js", "React", "TypeScript", "DevLog", "Career", "Infra"],
    { min: 1, max: 3 }
  );
  const publishedAt = faker.date.recent({ days: 120 }).toISOString();
  const readingTime = faker.number.int({ min: 2, max: 10 });
  const likes = faker.number.int({ min: 0, max: 500 });
  const comments = faker.number.int({ min: 0, max: 50 });
  const excerpt = faker.lorem.sentences({ min: 2, max: 3 });
  const content = faker.lorem.paragraphs({ min: 6, max: 10 }, "\n\n");

  return {
    id,
    slug,
    title,
    excerpt,
    coverImage,
    tags,
    publishedAt,
    readingTime,
    likes,
    comments,
    content,
    ...overrides,
  };
}

// 12개 정도 샘플 생성 (최근 날짜순 정렬)
export const MOCK_POSTS: Post[] = Array.from({ length: 12 })
  .map(() => generatePost())
  .sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
