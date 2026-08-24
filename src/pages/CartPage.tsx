import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/lib/cart-context";
import { formatCents } from "@/lib/money";
import { BookCover } from "@/components/BookCover";

export function CartPage() {
  const { items, subtotalCents, itemCount, setQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-stone-900">Your Cart</h1>
        <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center">
          <p className="text-stone-500">Your cart is empty.</p>
          <Link
            to="/catalog"
            className="mt-4 inline-block rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
          >
            Browse the catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-stone-900">Your Cart</h1>

      <div className="divide-y divide-stone-100 rounded-2xl border border-stone-200 bg-white">
        {items.map(({ book, quantity }) => (
          <div key={book.id} className="flex items-center gap-4 p-4">
            <Link to={`/books/${book.id}`} className="h-20 w-14 shrink-0 overflow-hidden rounded bg-brand-50">
              <BookCover book={book} imageClassName="h-full w-full object-cover" fallbackClassName="text-lg" />
            </Link>
            <div className="min-w-0 flex-1">
              <Link to={`/books/${book.id}`} className="line-clamp-1 font-semibold text-stone-900 hover:text-brand-700">
                {book.title}
              </Link>
              <p className="text-sm text-stone-500">{book.author}</p>
              <p className="text-sm font-medium text-brand-800">{formatCents(book.priceCents)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Decrease quantity"
                className="h-8 w-8 rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-50"
                onClick={() => setQuantity(book.id, quantity - 1)}
              >
                −
              </button>
              <span className="w-6 text-center text-sm font-medium">{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                className="h-8 w-8 rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-50"
                onClick={() => setQuantity(book.id, quantity + 1)}
              >
                +
              </button>
            </div>
            <div className="w-20 text-right font-semibold text-stone-900">
              {formatCents(book.priceCents * quantity)}
            </div>
            <button
              type="button"
              className="text-sm text-stone-400 hover:text-rose-600"
              onClick={() => removeItem(book.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-6">
        <div>
          <p className="text-sm text-stone-500">Subtotal ({itemCount} item{itemCount === 1 ? "" : "s"})</p>
          <p className="text-2xl font-bold text-stone-900">{formatCents(subtotalCents)}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/checkout")}
          className="rounded-lg bg-brand-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-800"
        >
          Proceed to checkout
        </button>
      </div>
    </div>
  );
}
