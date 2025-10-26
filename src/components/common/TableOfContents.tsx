"use client";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

type TableOfContentsProps = {
  containerSelector?: string;
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
  const [activeId, setActiveId] = useState("");
  const [isHeadingsLoaded, setIsHeadingsLoaded] = useState(false);
  const headingsRef = useRef<HTMLElement[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const root = document.querySelector(containerSelector);
    if (!root) return;

    const selector = [1, 2, 3, 4, 5, 6]
      .filter((level) => level >= minLevel && level <= maxLevel)
      .map((level) => `h${level}`)
      .join(",");

    const heads = Array.from(
      root.querySelectorAll<HTMLElement>(selector),
    ).filter((el) => el.id && (el.textContent ?? "").trim().length > 0);

    headingsRef.current = heads;
    setIsHeadingsLoaded(true);
  }, [containerSelector, minLevel, maxLevel]);

  useEffect(() => {
    if (!isHeadingsLoaded || headingsRef.current.length === 0) return;

    observerRef.current?.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target instanceof HTMLElement) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "0px 0px -60% 0px",
        threshold: [1.0],
      },
    );

    headingsRef.current.forEach((h) => {
      observer.observe(h);
    });
    observerRef.current = observer;

    return () => observer.disconnect();
  }, [isHeadingsLoaded]);

  if (!isHeadingsLoaded || headingsRef.current.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className={clsx("text-sm", "[&_a]:block [&_a]:truncate", className)}
    >
      <ul className="space-y-1">
        {headingsRef.current.map((h) => {
          const isActive = activeId === h.id;
          return (
            <li
              key={h.id}
              className={clsx(
                indentClass(h.tagName),
                "pl-3",
                isActive && "border-foreground border-l-2",
              )}
            >
              <a
                href={`#${h.id}`}
                aria-current={isActive ? "true" : undefined}
                className={clsx(
                  "text-muted-foreground transition-colors hover:text-foreground",
                  isActive && "font-bold text-foreground",
                )}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(h.id)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                  history.pushState(null, "", `#${h.id}`);
                }}
              >
                {(h.textContent ?? "").trim()}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function indentClass(tagName: string) {
  switch (tagName.toLowerCase()) {
    case "h2":
      return "pl-0";
    case "h3":
      return "pl-4";
    default:
      return "pl-8";
  }
}
