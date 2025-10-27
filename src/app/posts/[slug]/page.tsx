export const runtime = "edge";

import Image from "next/image";
import { notFound } from "next/navigation";
import { posts } from "v";
import { TableOfContents } from "@/components/common";
import Content from "@/components/common/Content";

function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const post = getPostBySlug(slug);

  if (post == null) notFound();

  return (
    <article className="container">
      <div className="mb-8">
        <h1>{post.title}</h1>
        {post.cover && (
          <Image
            src={post.cover}
            alt={post.title}
            width={100}
            height={100}
            className="mt-4 rounded-lg"
          />
        )}
        <p className="mt-2 text-muted-foreground">
          {new Date(post.date).toLocaleDateString("ko-KR")} ·{" "}
          {post.metadata.readingTime}분 읽기
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
        <Content content={post.content} />

        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-auto py-2">
            <TableOfContents />
          </div>
        </aside>
      </div>
    </article>
  );
}
