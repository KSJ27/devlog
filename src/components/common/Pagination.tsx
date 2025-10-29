import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Link from "next/link";

export function Pagination({
  current,
  total,
  basePath = "",
}: {
  current: number;
  total: number;
  basePath?: string;
}) {
  if (total <= 1) return null;

  const prev = current > 1 ? current - 1 : null;
  const next = current < total ? current + 1 : null;
  const pathOf = (p: number) => `${basePath}/${p}`;

  const pad = 5;
  const start = 5 * Math.floor((current - 1) / pad) + 1;
  const pages = Array.from(
    { length: start + pad > total ? total % pad : pad },
    (_, i) => start + i,
  );

  return (
    <nav className="mt-8 flex items-center justify-center gap-2 text-sm">
      <Link
        href={current !== 1 ? pathOf(1) : "#"}
        aria-disabled={!prev}
        aria-label="첫 페이지로 이동"
        className={`flex size-8 items-center justify-center rounded border ${current !== 1 ? "hover:bg-muted" : "pointer-events-none opacity-50"}`}
      >
        <ChevronsLeft size={16} />
      </Link>
      <Link
        href={prev ? pathOf(prev) : "#"}
        aria-disabled={!prev}
        aria-label="이전 페이지로 이동"
        className={`flex size-8 items-center justify-center rounded border ${prev ? "hover:bg-muted" : "pointer-events-none opacity-50"}`}
      >
        <ChevronLeft size={16} />
      </Link>

      {pages.map((p) => (
        <Link
          key={p}
          href={pathOf(p)}
          aria-current={p === current ? "page" : undefined}
          className={`flex size-8 items-center justify-center rounded border ${p === current ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
        >
          {p}
        </Link>
      ))}

      <Link
        href={next ? pathOf(next) : "#"}
        aria-disabled={!next}
        aria-label="다음 페이지로 이동"
        className={`flex size-8 items-center justify-center rounded border ${next ? "hover:bg-muted" : "pointer-events-none opacity-50"}`}
      >
        <ChevronRight size={16} />
      </Link>
      <Link
        href={current !== total ? pathOf(total) : "#"}
        aria-disabled={!next}
        aria-label="마지막 페이지로 이동"
        className={`flex size-8 items-center justify-center rounded border ${current !== total ? "hover:bg-muted" : "pointer-events-none opacity-50"}`}
      >
        <ChevronsRight size={16} />
      </Link>
    </nav>
  );
}
