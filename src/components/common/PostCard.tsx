import Image from "next/image";
import Link from "next/link";
import type { Post } from "v";

function PostCard({ post }: { post: Post }) {
  const { slug, title, excerpt, cover, date } = post;

  return (
    <li className="flex items-center justify-center py-6">
      <Link
        href={`/posts/${slug}`}
        className="flex h-[156px] w-[680px] flex-col items-center justify-between gap-4"
      >
        <div className="flex w-full flex-row items-start justify-between gap-16">
          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-2xl">{title}</h2>
            <p className="line-clamp-2 text-muted-foreground">{excerpt}</p>
          </div>
          {cover ? (
            <Image
              src={cover}
              alt="hello"
              width={720}
              height={480}
              className="h-[120px] w-[180px]"
            />
          ) : null}
        </div>

        <div className="flex w-full flex-row items-center justify-between">
          <div className="text-muted-foreground text-sm">
            {new Date(date).toLocaleDateString("ko-KR")}
          </div>
          <div className="text-muted-foreground text-sm">뭐가 올까</div>
        </div>
      </Link>
    </li>
  );
}

export { PostCard };
