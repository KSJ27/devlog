"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  DotButton,
} from "@/components/ui/carousel";
import { postsSortedByDate } from "@/lib/posts";

export default function PostsCarousel() {
  return (
    <Carousel opts={{ loop: true }} className="w-full">
      <CarouselContent>
        {postsSortedByDate.slice(0, 5).map((post) => (
          <CarouselItem key={post.slug}>
            <Link
              href={post.permalink}
              className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl bg-card hover:cursor-pointer hover:bg-accent hover:text-accent-foreground"
            >
              {post.cover ? (
                <Image
                  src={post.cover}
                  alt="hello"
                  width={720}
                  height={480}
                  className="aspect-auto rounded-xl"
                />
              ) : null}
              <p className="self-start text-2xl">{post.title}</p>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="my-4 flex items-center justify-between">
        <div className="flex items-center justify-start">
          {Array.from(
            { length: postsSortedByDate.length },
            (_, index) => index,
          ).map((item, index) => (
            <DotButton key={item} index={index} />
          ))}
        </div>
        <div className="flex gap-2">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </div>
    </Carousel>
  );
}
