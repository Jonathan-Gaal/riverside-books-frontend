import { useEffect, useState } from "react";
import { fetchOpenLibraryCoverUrl } from "@/lib/book-cover";
import type { Book } from "@/types";

// Prefers the backend's own imageUrl (real data, once staff add it via Product
// B) and only falls back to an Open Library lookup when that's empty.
export function useBookCoverUrl(book: Book): string | null {
  const [coverUrl, setCoverUrl] = useState<string | null>(book.imageUrl);

  useEffect(() => {
    if (book.imageUrl) {
      setCoverUrl(book.imageUrl);
      return;
    }

    let cancelled = false;
    setCoverUrl(null);
    fetchOpenLibraryCoverUrl(book.title, book.author).then((url) => {
      if (!cancelled) {
        setCoverUrl(url);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [book.id, book.imageUrl, book.title, book.author]);

  return coverUrl;
}
