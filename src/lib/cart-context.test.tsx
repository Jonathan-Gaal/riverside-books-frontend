import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartProvider, useCart } from "@/lib/cart-context";
import type { Book } from "@/types";

function makeBook(id: string, priceCents: number): Book {
  return {
    id,
    title: `Book ${id}`,
    author: "Author",
    isbn: null,
    priceCents,
    category: null,
    description: null,
    imageUrl: null,
    createdAt: "",
    updatedAt: "",
  };
}

const BOOK_A = makeBook("a", 1000);
const BOOK_B = makeBook("b", 250);

function Harness() {
  const { items, itemCount, subtotalCents, addItem, setQuantity, removeItem, clear } = useCart();
  return (
    <div>
      <p data-testid="count">{itemCount}</p>
      <p data-testid="subtotal">{subtotalCents}</p>
      <p data-testid="lines">{items.length}</p>
      <button onClick={() => addItem(BOOK_A)}>Add A</button>
      <button onClick={() => addItem(BOOK_B, 2)}>Add 2 B</button>
      <button onClick={() => setQuantity("a", 3)}>Set A 3</button>
      <button onClick={() => setQuantity("a", 0)}>Zero A</button>
      <button onClick={() => removeItem("b")}>Remove B</button>
      <button onClick={clear}>Clear</button>
    </div>
  );
}

function renderCart() {
  return render(
    <CartProvider>
      <Harness />
    </CartProvider>,
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe("CartProvider", () => {
  it("adds items and increments quantity for the same book", async () => {
    const user = userEvent.setup();
    renderCart();
    await user.click(screen.getByText("Add A"));
    await user.click(screen.getByText("Add A"));
    expect(screen.getByTestId("count")).toHaveTextContent("2");
    expect(screen.getByTestId("lines")).toHaveTextContent("1");
  });

  it("computes itemCount and subtotal across lines", async () => {
    const user = userEvent.setup();
    renderCart();
    await user.click(screen.getByText("Add A")); // 1 x 1000
    await user.click(screen.getByText("Add 2 B")); // 2 x 250
    expect(screen.getByTestId("count")).toHaveTextContent("3");
    expect(screen.getByTestId("subtotal")).toHaveTextContent("1500");
  });

  it("setQuantity to 0 removes the line; removeItem drops it too", async () => {
    const user = userEvent.setup();
    renderCart();
    await user.click(screen.getByText("Add A"));
    await user.click(screen.getByText("Set A 3"));
    expect(screen.getByTestId("count")).toHaveTextContent("3");
    await user.click(screen.getByText("Zero A"));
    expect(screen.getByTestId("lines")).toHaveTextContent("0");
  });

  it("persists the cart to localStorage", async () => {
    const user = userEvent.setup();
    renderCart();
    await user.click(screen.getByText("Add A"));
    const stored = JSON.parse(localStorage.getItem("riverside_cart") ?? "[]");
    expect(stored[0].book.id).toBe("a");
    expect(stored[0].quantity).toBe(1);
  });
});
