import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, ApiError } from "@/lib/api";
import { useCustomer } from "@/lib/customer-context";
import { STAMPS_PER_REWARD } from "@/lib/loyalty";
import { formatCents } from "@/lib/money";
import type { Order } from "@/types";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { GuestContactFields, type GuestContact } from "@/components/GuestContactFields";

const EMPTY_CONTACT: GuestContact = { name: "", email: "", phone: "" };

function GetStartedForm() {
  const { identify } = useCustomer();
  const [contact, setContact] = useState<GuestContact>(EMPTY_CONTACT);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!contact.email.trim() && !contact.phone.trim()) {
      setErrorMessage("Add an email or phone number so we can set up your account.");
      return;
    }
    setSubmitting(true);
    setErrorMessage(null);
    try {
      await identify({
        name: contact.name.trim(),
        ...(contact.email.trim() && { email: contact.email.trim() }),
        ...(contact.phone.trim() && { phone: contact.phone.trim() }),
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setErrorMessage(
          "There's already an account with that email or phone. If it's yours, place a pre-order or reserve an event with the same details and we'll pick it up automatically.",
        );
      } else {
        setErrorMessage(
          error instanceof ApiError ? error.message : "Couldn't set up your account. Please try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-stone-900">Set up your lightweight account</h2>
      <p className="mt-1 text-sm text-stone-500">
        No password needed — just your name and an email or phone number. Placing a pre-order or
        reserving an event also links to this account automatically if you use the same details.
      </p>
      <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit}>
        <GuestContactFields contact={contact} onChange={setContact} idPrefix="account" />
        {errorMessage && <p className="text-sm text-rose-600">{errorMessage}</p>}
        <button
          type="submit"
          className="mt-2 self-start rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800 disabled:cursor-default disabled:opacity-50"
          disabled={submitting}
        >
          {submitting ? "Setting up…" : "Continue"}
        </button>
      </form>
    </div>
  );
}

function OrderHistory({ customerId }: { customerId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErrorMessage(null);

    // GET /orders?customerId= is public self-service scope -- no staff session
    // needed when a customerId is present (see apps/backend CLAUDE.md).
    api
      .get<Order[]>(`/orders?customerId=${customerId}`)
      .then((result) => {
        if (!cancelled) {
          setOrders(result);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setErrorMessage(
            error instanceof ApiError ? error.message : "Couldn't load your order history.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [customerId]);

  if (loading) {
    return <p className="text-sm text-stone-500">Loading order history…</p>;
  }
  if (errorMessage) {
    return <p className="text-sm text-rose-600">{errorMessage}</p>;
  }
  if (orders.length === 0) {
    return <p className="text-sm text-stone-500">No pre-orders yet.</p>;
  }

  return (
    <div className="divide-y divide-stone-100">
      {orders.map((order) => (
        <Link
          key={order.id}
          to={`/orders/${order.id}`}
          className="flex items-center justify-between gap-3 py-3 text-sm hover:text-brand-700"
        >
          <span className="text-stone-700">
            {new Date(order.createdAt).toLocaleDateString()} — {formatCents(order.totalCents)}
          </span>
          <OrderStatusBadge status={order.status} />
        </Link>
      ))}
    </div>
  );
}

export function AccountPage() {
  const { customer, signOut, refresh } = useCustomer();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (customer) {
      // Best-effort: pull the latest stamp count via GET /customers/:id (public).
      refresh().catch(() => undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer?.id]);

  if (!customer) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-stone-900">My Account</h1>
        <GetStartedForm />
      </div>
    );
  }

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await refresh();
    } catch {
      // Non-critical; the previously known stamp count stays on screen.
    } finally {
      setRefreshing(false);
    }
  }

  const stampProgress = Math.min(customer.loyaltyStampCount / STAMPS_PER_REWARD, 1) * 100;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">My Account</h1>
        <button
          type="button"
          className="rounded-lg border border-stone-300 px-4 py-2 text-sm text-stone-600 hover:bg-stone-50"
          onClick={signOut}
        >
          Not you? Switch account
        </button>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <p className="font-medium text-stone-900">{customer.name}</p>
        <p className="text-sm text-stone-500">{customer.email ?? customer.phone}</p>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-900">Loyalty Stamps</h2>
        <p className="mt-2 text-3xl font-bold text-brand-800">
          {customer.loyaltyStampCount}{" "}
          <span className="text-base font-medium text-stone-400">/ {STAMPS_PER_REWARD}</span>
        </p>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-stone-100">
          <div
            className="h-full rounded-full bg-brand-600 transition-all"
            style={{ width: `${stampProgress}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-stone-500">
          Earn a stamp with every in-store purchase. Collect {STAMPS_PER_REWARD} stamps for a free
          reward — ask staff to redeem it at checkout.
        </p>
        <button
          type="button"
          className="mt-4 rounded-lg border border-stone-300 px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 disabled:cursor-default disabled:opacity-50"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-900">Pre-Order History</h2>
        <div className="mt-2">
          <OrderHistory customerId={customer.id} />
        </div>
      </div>
    </div>
  );
}
