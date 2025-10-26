import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { defineConfig, s } from "velite";
import { transformerCopyButton } from "@/lib/copy-button";

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
          content: s.markdown({
            remarkPlugins: [remarkGfm], // 체크박스/테이블 등 GFM
            rehypePlugins: [
              rehypeSlug, // 제목에 고유 ID 추가
              [
                rehypeAutolinkHeadings,
                {
                  behavior: "wrap",
                  properties: {
                    class: "heading-anchor",
                  },
                },
              ],
              [
                rehypePrettyCode,
                {
                  theme: {
                    light: "github-light",
                    dark: "github-dark-dimmed",
                  },
                  transformers: [
                    transformerCopyButton({
                      visibility: "hover",
                      feedbackDuration: 1_000,
                    }),
                  ],
                },
              ],
            ],
          }), // transform markdown to html
        })
        // more additional fields (computed fields)
        .transform((data) => {
          // Trim tags
          const cleanedTags = (data.tags ?? [])
            .map((t) => String(t).trim().toLowerCase())
            .filter(Boolean);
          const uniqueTags = Array.from(new Set(cleanedTags));

          return {
            ...data,
            tags: uniqueTags,
            permalink: `/posts/${data.slug}`,
          };
        }),
    },
  },
});
