import { posts } from "#site/content";
import { Pagination } from "@/components/common/Pagination";
import { PostCard } from "@/components/common/PostCard";
import { getPageSlice, getTotalPages, PAGE_SIZE } from "@/lib/paginate";

export const dynamic = "force-static";

type Props = {
  params: Promise<{ page: string }>;
};

export default async function Posts({ params }: Props) {
  const currentPage = Number((await params).page) || 1;
  const totalPages = getTotalPages(posts.length, PAGE_SIZE);

  const { start, end } = getPageSlice(currentPage, PAGE_SIZE);
  const pagePosts = posts.slice(start, end);

  return (
    <main className="container my-6">
      <ul className="flex flex-col divide-y divide-border">
        {pagePosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </ul>
      <Pagination current={currentPage} total={totalPages} basePath="/posts/page" />
    </main>
  );
}
