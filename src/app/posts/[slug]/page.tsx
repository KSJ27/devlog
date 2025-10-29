export const runtime = "edge";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { posts } from "#site/content";
import { TableOfContents } from "@/components/common";
import Content from "@/components/common/Content";
import { Badge } from "@/components/ui/badge";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;

  return {
    title: slug,
  };
}

function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export default async function Post({ params }: Props) {
  const slug = (await params).slug;
  const post = getPostBySlug(slug);

  if (post == null) notFound();

  return (
    <main className="container relative my-8">
      <article className="w-full">
        <h1 className="font-bold text-3xl">{post.title}</h1>
        <p className="mt-2 text-muted-foreground">
          {new Date(post.date).toLocaleDateString("ko-KR")}
        </p>
        <ul className="mt-2 flex flex-wrap items-center gap-2">
          {post.tags.map((tag) => (
            <li key={tag}>
              <Badge variant="outline" className="select-none bg-secondary">
                {tag}
              </Badge>
            </li>
          ))}
        </ul>
        <Content content={post.content} />
      </article>
      <aside className="-right-70 pointer-events-none absolute inset-y-0 top-0 hidden xl:block">
        <div className="pointer-events-auto sticky top-23 w-60">
          <TableOfContents />
        </div>
      </aside>
    </main>
  );
}
