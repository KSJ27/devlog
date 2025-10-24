import type { Post } from "@/types";

export async function getPosts(): Promise<Post[]> {
  "use server";

  const response = await fetch("https://api.example.com/posts", {
    method: "GET",
  });
  const jsonData = await response.json();

  return jsonData.data;
}

export async function getPost(slug: Post["slug"]): Promise<Post> {
  "use server";

  const response = await fetch(`https://api.example.com/posts/${slug}`, {
    method: "GET",
  });
  const jsonData = await response.json();

  return jsonData.data;
}
