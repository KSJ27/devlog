"use client";

import Autoplay from "embla-carousel-autoplay";
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
    <Carousel
      opts={{ loop: true }}
      className="w-full border"
    >
      <CarouselContent>
        {postsSortedByDate.slice(0, 5).map((post) => (
          <CarouselItem key={post.slug}>
            <div className="p-1">
              <div className="flex items-center justify-center p-6">
                <span className="font-semibold text-4xl">{post.title}</span>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex items-center justify-between">
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
