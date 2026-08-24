import { useCallback } from "react";
import { Navigate } from "react-router-dom";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { getStripePromise } from "@/lib/stripe";
import { api } from "@/lib/api";
import { useCart } from "@/lib/cart-context";
import { useCustomer } from "@/lib/customer-context";

export function CheckoutPage() {
  const { items } = useCart();
  const { customer } = useCustomer();

  // Ask the backend to create the Checkout Session and hand back its client secret.
  // Sending only book ids + quantities -- the server prices the order. customerId links
  // the resulting order to a signed-in customer; guests are matched by Stripe's email.
  const fetchClientSecret = useCallback(() => {
    return api
      .post<{ clientSecret: string }>("/checkout/session", {
        items: items.map((i) => ({ bookId: i.book.id, quantity: i.quantity })),
        ...(customer?.id && { customerId: customer.id }),
      })
      .then((data) => data.clientSecret);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-stone-900">Checkout</h1>
      <div className="rounded-2xl border border-stone-200 bg-white p-2">
        <EmbeddedCheckoutProvider stripe={getStripePromise()} options={{ fetchClientSecret }}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    </div>
  );
}
