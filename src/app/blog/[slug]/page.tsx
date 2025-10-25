export const runtime = "edge";

import Image from "next/image";
import { notFound } from "next/navigation";
import { posts } from "../../../../.velite";

interface PostProps {
  params: {
    slug: string;
  };
}

function getPostBySlug(slug: string) {
  console.log(slug);
  return posts.find((post) => post.slug === slug);
}

export default async function PostPage({ params }: PostProps) {
  const slug = (await params).slug;
  const post = getPostBySlug(slug);
  if (post == null) notFound();

  return (
    <article className="container">
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
        {new Date(post.date).toLocaleDateString("ko-KR")}
        {post.metadata.readingTime}분 읽기
      </p>
      <div className="mt-8 whitespace-pre-line">{post.content}</div>
    </article>
  );
}
