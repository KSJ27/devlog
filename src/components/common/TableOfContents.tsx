"use client";

import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";

type TocItem = {
  id: string;
  text: string;
  level: number; // 2 for h2, 3 for h3, 4 for h4
};

export type TableOfContentsProps = {
  /** CSS selector of the container that includes article headings */
  containerSelector?: string;
  /** Heading levels to include */
  minLevel?: 2 | 3;
  maxLevel?: 3 | 4;
  className?: string;
};

export function TableOfContents({
  containerSelector = "#post-content",
  minLevel = 2,
  maxLevel = 4,
  className,
}: TableOfContentsProps) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const root = document.querySelector(containerSelector) ?? undefined;
    if (!root) return;

    const selector = [2, 3, 4]
      .filter((lvl) => lvl >= minLevel && lvl <= maxLevel)
      .map((lvl) => `h${lvl}`)
      .join(",");

    const headings = Array.from(root.querySelectorAll<HTMLElement>(selector));

    const nextItems: TocItem[] = headings
      .filter((el) => !!el.id)
      .map((el) => ({
        id: el.id,
        text: el.textContent?.trim() ?? "",
        level: Number(el.tagName.substring(1)) as 2 | 3 | 4,
      }))
      .filter((it) => it.text.length > 0);

    setItems(nextItems);

    // Observe headings for active state
    observerRef.current?.disconnect();
    const observer = new IntersectionObserver(
      (entries) => {
        // Choose the most visible entry above threshold
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target instanceof HTMLElement) {
          setActiveId(visible[0].target.id);
        } else {
          // Fallback: find the last heading above viewport
          const fromTop = headings
            .filter((h) => h.getBoundingClientRect().top <= 80)
            .at(-1);
          if (fromTop?.id) setActiveId(fromTop.id);
        }
      },
      {
        rootMargin: "-64px 0px -60% 0px",
        threshold: [0.1, 0.5, 1],
      },
    );

    for (const h of headings) observer.observe(h);
    observerRef.current = observer;

    return () => observer.disconnect();
  }, [containerSelector, minLevel, maxLevel]);

  const hasItems = items.length > 0;

  const grouped = useMemo(() => items, [items]);

  if (!hasItems) return null;

  return (
    <nav
      aria-label="Table of contents"
      className={clsx("text-sm", "[&_a]:block [&_a]:truncate", className)}
    >
      <ul className="space-y-1">
        {grouped.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li
              key={item.id}
              className={clsx(
                indentClass(item.level),
                "pl-3",
                isActive && "border-foreground border-l-2",
              )}
            >
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={clsx(
                  "text-muted-foreground transition-colors hover:text-foreground",
                  isActive && "font-bold text-foreground",
                )}
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById(item.id);
                  target?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                  history.pushState(null, "", `#${item.id}`);
                }}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function indentClass(level: number) {
  switch (level) {
    case 2:
      return "pl-0";
    case 3:
      return "pl-4";
    default:
      return "pl-8";
  }
}
