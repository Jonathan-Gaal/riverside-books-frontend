import { useEffect, useState } from "react";

const BUTTON_CLASSES =
  "rounded-lg border border-stone-300 px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-50 disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent";

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const [jumpToPage, setJumpToPage] = useState(String(currentPage));

  // Keep the jump-to-page box in sync when paging happens via the arrow buttons.
  useEffect(() => {
    setJumpToPage(String(currentPage));
  }, [currentPage]);

  function goToPage(page: number) {
    onPageChange(Math.min(Math.max(page, 1), totalPages));
  }

  function handleJumpSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = Number(jumpToPage);
    if (Number.isInteger(parsed)) {
      goToPage(parsed);
    }
  }

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        className={BUTTON_CLASSES}
        onClick={() => goToPage(1)}
        disabled={currentPage === 1}
        aria-label="First page"
      >
        « First
      </button>
      <button
        type="button"
        className={BUTTON_CLASSES}
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ‹ Back
      </button>

      <span className="px-3 text-sm text-stone-600">
        Page {currentPage} of {totalPages}
      </span>

      <button
        type="button"
        className={BUTTON_CLASSES}
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next ›
      </button>
      <button
        type="button"
        className={BUTTON_CLASSES}
        onClick={() => goToPage(totalPages)}
        disabled={currentPage === totalPages}
        aria-label="Last page"
      >
        Last »
      </button>

      <form className="ml-2 flex items-center gap-2" onSubmit={handleJumpSubmit} noValidate>
        <label htmlFor="page-jump" className="text-sm text-stone-500">
          Go to page
        </label>
        <input
          id="page-jump"
          type="number"
          min={1}
          max={totalPages}
          value={jumpToPage}
          onChange={(event) => setJumpToPage(event.target.value)}
          className="w-16 rounded-lg border border-stone-300 px-2 py-1.5 text-center text-sm"
        />
        <button type="submit" className={BUTTON_CLASSES}>
          Go
        </button>
      </form>
    </div>
  );
}
