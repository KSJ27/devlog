import { HttpResponse, http } from "msw";
import type { Post } from "@/types";
import { MOCK_POSTS } from "./factory";

const posts = MOCK_POSTS;

export const handlers = [
  http.get("https://api.example.com/posts", () => {
    return HttpResponse.json({
      data: posts,
    });
  }),
  http.get<{ slug: Post["slug"] }>(
    `https://api.example.com/posts/:slug`,
    ({ params }) => {
      const post = posts.find((p) => p.slug === params.slug) || null;

      return HttpResponse.json({
        data: post,
      });
    }
  ),
];
