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

  const pathOf = (p: number) =>
    p === 1 ? `${basePath}/1` : `${basePath}/${p}`;

  // 간단한 페이지 번호(최대 5개 예시)
  const pad = 2;
  const start = Math.max(1, current - pad);
  const end = Math.min(total, current + pad);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav className="mt-8 flex items-center justify-center gap-2 text-sm">
      <Link
        href={prev ? pathOf(prev) : "#"}
        aria-disabled={!prev}
        className={`rounded border px-3 py-1 ${prev ? "hover:bg-muted" : "pointer-events-none opacity-50"}`}
      >
        Prev
      </Link>

      {start > 1 && (
        <>
          <Link
            href={pathOf(1)}
            className="rounded border px-3 py-1 hover:bg-muted"
          >
            1
          </Link>
          {start > 2 && <span className="px-1">…</span>}
        </>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={pathOf(p)}
          aria-current={p === current ? "page" : undefined}
          className={`rounded border px-3 py-1 ${p === current ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
        >
          {p}
        </Link>
      ))}

      {end < total && (
        <>
          {end < total - 1 && <span className="px-1">…</span>}
          <Link
            href={pathOf(total)}
            className="rounded border px-3 py-1 hover:bg-muted"
          >
            {total}
          </Link>
        </>
      )}

      <Link
        href={next ? pathOf(next) : "#"}
        aria-disabled={!next}
        className={`rounded border px-3 py-1 ${next ? "hover:bg-muted" : "pointer-events-none opacity-50"}`}
      >
        Next
      </Link>
    </nav>
  );
}
