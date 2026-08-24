import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Book } from "@/types";

const STORAGE_KEY = "riverside_cart";

// We snapshot the book for display so the cart renders without refetching. The actual
// charge is always re-priced server-side at checkout from Book.priceCents, so a stale
// snapshot price here is cosmetic only.
export type CartItem = { book: Book; quantity: number };

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotalCents: number;
  addItem: (book: Book, quantity?: number) => void;
  setQuantity: (bookId: string, quantity: number) => void;
  removeItem: (bookId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadStoredCart(): CartItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadStoredCart());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(book: Book, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.book.id === book.id);
      if (existing) {
        return prev.map((i) =>
          i.book.id === book.id ? { ...i, quantity: i.quantity + quantity } : i,
        );
      }
      return [...prev, { book, quantity }];
    });
  }

  function setQuantity(bookId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(bookId);
      return;
    }
    setItems((prev) => prev.map((i) => (i.book.id === bookId ? { ...i, quantity } : i)));
  }

  function removeItem(bookId: string) {
    setItems((prev) => prev.filter((i) => i.book.id !== bookId));
  }

  function clear() {
    setItems([]);
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotalCents = items.reduce((sum, i) => sum + i.book.priceCents * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, itemCount, subtotalCents, addItem, setQuantity, removeItem, clear }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
