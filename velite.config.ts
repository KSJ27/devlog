import { defineConfig, s } from "velite";

export default defineConfig({
  collections: {
    posts: {
      name: "Post", // collection type name
      pattern: "posts/**/*.md", // content files glob pattern
      schema: s
        .object({
          title: s.string().max(99), // Zod primitive type
          slug: s.slug("posts"), // validate format, unique in posts collection
          date: s.isodate(), // input Date-like string, output ISO Date string.
          cover: s.image().optional(), // input image relative path, output image object with blurImage.
          video: s.file().optional(), // input file relative path, output file public path.
          metadata: s.metadata(), // extract markdown reading-time and word-count.
          excerpt: s.excerpt(), // excerpt of markdown content
          tags: s.array(s.string()).optional(),
          content: s.markdown(), // transform markdown to html
        })
        // more additional fields (computed fields)
        .transform((data) => {
          const cleanedTags = (data.tags ?? [])
            .map((t) => String(t).trim().toLowerCase())
            .filter(Boolean);
          // 중복 제거:
          const uniqueTags = Array.from(new Set(cleanedTags));
          return { ...data, tags: uniqueTags, permalink: `/blog/${data.slug}` };
        }),
    },
  },
});
