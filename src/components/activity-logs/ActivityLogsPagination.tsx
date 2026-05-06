"use client";

import React from "react";

type ActivityLogsPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function buildVisiblePages(page: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const visible = new Set<number>([1, totalPages, page - 1, page, page + 1]);
  return Array.from(visible)
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((a, b) => a - b);
}

export default function ActivityLogsPagination({ page, totalPages, onPageChange }: ActivityLogsPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = buildVisiblePages(page, totalPages);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[color:var(--adm-border)] bg-[var(--adm-surface)] p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="text-sm text-[var(--adm-fg-dim)]">
        Page <span className="font-semibold text-[var(--adm-fg)]">{page}</span> of <span className="font-semibold text-[var(--adm-fg)]">{totalPages}</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className="rounded-lg border border-[color:var(--adm-border)] px-3 py-2 text-sm font-semibold text-[var(--adm-fg-dim)] transition-colors disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[var(--adm-hover)]"
        >
          First
        </button>
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="rounded-lg border border-[color:var(--adm-border)] px-3 py-2 text-sm font-semibold text-[var(--adm-fg-dim)] transition-colors disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[var(--adm-hover)]"
        >
          Prev
        </button>

        {visiblePages.map((visiblePage, index) => {
          const previous = visiblePages[index - 1];
          const needsGap = previous && visiblePage - previous > 1;

          return (
            <React.Fragment key={visiblePage}>
              {needsGap && <span className="px-1 text-[var(--adm-fg-faint)]">...</span>}
              <button
                type="button"
                onClick={() => onPageChange(visiblePage)}
                className={`min-w-10 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                  visiblePage === page
                    ? "border-[var(--adm-accent)] bg-[var(--adm-accent)] text-white"
                    : "border-[color:var(--adm-border)] text-[var(--adm-fg-dim)] hover:bg-[var(--adm-hover)]"
                }`}
              >
                {visiblePage}
              </button>
            </React.Fragment>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="rounded-lg border border-[color:var(--adm-border)] px-3 py-2 text-sm font-semibold text-[var(--adm-fg-dim)] transition-colors disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[var(--adm-hover)]"
        >
          Next
        </button>
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          className="rounded-lg border border-[color:var(--adm-border)] px-3 py-2 text-sm font-semibold text-[var(--adm-fg-dim)] transition-colors disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[var(--adm-hover)]"
        >
          Last
        </button>
      </div>
    </div>
  );
}
