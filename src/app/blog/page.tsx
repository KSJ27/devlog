import { PostCard } from "@/components/common/PostCard";
import { posts } from "../../../.velite";

export default async function Blog() {
  return (
    <main className="container">
      <ul className="flex flex-col divide-y divide-border">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </ul>
    </main>
  );
}
