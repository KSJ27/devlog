import { posts } from "#site/content";

const postsSortedByDate = posts.sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

export { postsSortedByDate };
