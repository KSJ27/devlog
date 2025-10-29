import { posts } from "#site/content";
import { PostCard } from "@/components/common/PostCard";

export default async function Posts() {
  return (
    <main className="container my-6">
      <ul className="flex flex-col divide-y divide-border">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </ul>
    </main>
  );
}
