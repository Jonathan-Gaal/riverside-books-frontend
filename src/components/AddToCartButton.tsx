import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import type { Book } from "@/types";

// Adds a book to the cart with brief "Added" feedback. Isolates its click so it works
// inside a card <Link>. Disabled for out-of-stock titles.
export function AddToCartButton({
  book,
  className = "",
}: {
  book: Book;
  className?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const outOfStock = book.inventory?.status === "out_of_stock";

  function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    addItem(book);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={outOfStock}
      className={`rounded-lg bg-brand-700 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800 disabled:cursor-default disabled:bg-stone-300 ${className}`}
    >
      {outOfStock ? "Out of stock" : added ? "Added ✓" : "Add to cart"}
    </button>
  );
}
