import { Link } from "react-router-dom";
import type { Book } from "@/types";
import { formatCents } from "@/lib/money";
import { StockBadge } from "@/components/StockBadge";
import { BookCover } from "@/components/BookCover";

export function BookCard({ book }: { book: Book }) {
  return (
    <Link
      to={`/books/${book.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex aspect-[3/4] items-center justify-center bg-brand-50">
        <BookCover book={book} imageClassName="h-full w-full object-cover" fallbackClassName="text-4xl" />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="line-clamp-2 font-semibold text-stone-900 group-hover:text-brand-700">
          {book.title}
        </p>
        <p className="text-sm text-stone-500">{book.author}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-semibold text-brand-800">{formatCents(book.priceCents)}</span>
          <StockBadge status={book.inventory?.status} />
        </div>
      </div>
    </Link>
  );
}
