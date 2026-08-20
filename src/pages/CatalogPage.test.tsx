import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CatalogPage } from "@/pages/CatalogPage";
import type { Book } from "@/types";

const SAMPLE_BOOK: Book = {
  id: "book-1",
  title: "The Pragmatic Programmer",
  author: "David Thomas",
  isbn: null,
  priceCents: 2499,
  category: "Technology",
  description: null,
  imageUrl: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  inventory: {
    id: "inv-1",
    bookId: "book-1",
    quantityOnHand: 5,
    reorderThreshold: 2,
    status: "in_stock",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
};

function jsonResponse(data: unknown) {
  return Promise.resolve({ ok: true, json: () => Promise.resolve({ data, error: null }) });
}

function renderCatalogPage() {
  return render(
    <MemoryRouter>
      <CatalogPage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("CatalogPage", () => {
  it("shows a clear empty state when the search has no matches", async () => {
    vi.stubGlobal("fetch", vi.fn().mockImplementation(() => jsonResponse([])));
    renderCatalogPage();

    expect(
      await screen.findByText("No matches. Try a different title, author, or category."),
    ).toBeInTheDocument();
  });

  it("renders matching books with their stock status", async () => {
    vi.stubGlobal("fetch", vi.fn().mockImplementation(() => jsonResponse([SAMPLE_BOOK])));
    renderCatalogPage();

    expect(await screen.findByText("The Pragmatic Programmer")).toBeInTheDocument();
    expect(screen.getByText("In Stock")).toBeInTheDocument();
  });
});
