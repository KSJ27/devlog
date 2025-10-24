import { getPosts } from "@/api/posts";
import { PostCard } from "@/components/common/PostCard";

export default async function Blog() {
  const posts = await getPosts();
  return (
    <main className="container">
      <ul className="flex flex-col divide-y divide-border">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </ul>
    </main>
  );
}
