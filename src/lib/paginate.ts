export const PAGE_SIZE = 10;

export function getTotalPages(totalItems: number, pageSize = PAGE_SIZE) {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}

export function getPageSlice(page: number, pageSize = PAGE_SIZE) {
  const p = Math.max(1, page);
  const start = (p - 1) * pageSize;
  const end = start + pageSize;
  return { start, end, page: p };
}
