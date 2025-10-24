import Image from "next/image";
import { notFound } from "next/navigation";
import { getPost } from "@/api/posts";

export default async function BlogDetail({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return notFound();

  return (
    <article className="container">
      <h1>{post.title}</h1>
      {post.coverImage && (
        <Image
          src={post.coverImage}
          alt={post.title}
          width={100}
          height={100}
          className="mt-4 rounded-lg"
        />
      )}
      <p className="mt-2 text-muted-foreground">
        {new Date(post.publishedAt).toLocaleDateString("ko-KR")}
        {post.readingTime}분 읽기
      </p>
      <div className="mt-8 whitespace-pre-line">{post.content}</div>
    </article>
  );
}
