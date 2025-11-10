import { Calendar, Clock } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { posts } from "#site/content";
import { TableOfContents } from "@/components/common";
import Content from "@/components/common/Content";
import Giscus from "@/components/common/Giscus";
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

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export default async function Post({ params }: Props) {
  const slug = (await params).slug;
  const post = getPostBySlug(slug);

  if (post == null) notFound();

  return (
    <main className="container relative my-10">
      <article className="w-full">
        <h1 className="font-bold text-3xl">{post.title}</h1>
        <ul className="mt-5 flex flex-wrap items-center gap-2">
          {post.tags.map((tag) => (
            <li key={tag}>
              <Badge variant="outline" className="select-none bg-secondary">
                {tag}
              </Badge>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
          <div className="flex items-center gap-1">
            <Calendar size={14} className="shrink-0" />
            <span>
              {new Date(post.date).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Clock size={14} className="shrink-0" />
            <span>{post.metadata.readingTime}분</span>
          </div>
        </div>
        <Content content={post.content} />
      </article>
      <aside className="-right-70 pointer-events-none absolute inset-y-0 top-0 hidden xl:block">
        <div className="pointer-events-auto sticky top-23 w-60">
          <TableOfContents />
        </div>
      </aside>
      <Giscus />
    </main>
  );
}
