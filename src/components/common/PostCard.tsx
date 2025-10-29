import Image from "next/image";
import Link from "next/link";
import type { Post } from "#site/content";
import { Badge } from "@/components/ui/badge";

function PostCard({ post }: { post: Post }) {
  const { slug, title, excerpt, cover, date, tags } = post;

  return (
    <li className="flex items-center justify-center py-6">
      <Link
        href={`/posts/${slug}`}
        className="flex h-[144px] w-[680px] flex-col items-center justify-center gap-4"
      >
        <div className="flex h-full w-full flex-row items-center justify-between gap-16">
          <div className="flex h-full flex-1 flex-col gap-2">
            <h2 className="font-bold text-2xl">{title}</h2>
            <p className="flex-1 overflow-hidden text-ellipsis text-muted-foreground">
              {excerpt}
            </p>
            <div className="flex w-full flex-row items-center justify-between">
              <div className="text-muted-foreground text-sm">
                {new Date(date).toLocaleDateString("ko-KR")}
              </div>
              <div className="text-muted-foreground text-sm">
                <ul className="flex gap-1.5">
                  {tags.slice(0, 3).map((tag) => (
                    <li key={tag}>
                      <Badge
                        variant="outline"
                        className="select-none bg-secondary"
                      >
                        {tag}
                      </Badge>
                    </li>
                  ))}
                  {tags.length > 3 && (
                    <Badge
                      variant="outline"
                      className="select-none bg-secondary"
                    >
                      +{tags.length - 3}
                    </Badge>
                  )}
                </ul>
              </div>
            </div>
          </div>
          {cover ? (
            <Image
              src={cover}
              alt="hello"
              width={720}
              height={480}
              className="h-[120px] w-[180px] rounded-xl"
            />
          ) : null}
        </div>
      </Link>
    </li>
  );
}

export { PostCard };
