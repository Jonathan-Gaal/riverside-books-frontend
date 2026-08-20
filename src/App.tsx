import { Navigate, Route, Routes } from "react-router-dom";
import { CustomerProvider } from "@/lib/customer-context";
import { NavBar } from "@/components/NavBar";
import { CatalogPage } from "@/pages/CatalogPage";
import { BookDetailPage } from "@/pages/BookDetailPage";
import { AccountPage } from "@/pages/AccountPage";
import { OrderStatusPage } from "@/pages/OrderStatusPage";
import { EventsPage } from "@/pages/EventsPage";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50">
      <NavBar />
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/catalog" replace />} />
      <Route
        path="/catalog"
        element={
          <AppLayout>
            <CatalogPage />
          </AppLayout>
        }
      />
      <Route
        path="/books/:id"
        element={
          <AppLayout>
            <BookDetailPage />
          </AppLayout>
        }
      />
      <Route
        path="/events"
        element={
          <AppLayout>
            <EventsPage />
          </AppLayout>
        }
      />
      <Route
        path="/account"
        element={
          <AppLayout>
            <AccountPage />
          </AppLayout>
        }
      />
      <Route
        path="/orders/:id"
        element={
          <AppLayout>
            <OrderStatusPage />
          </AppLayout>
        }
      />
      <Route path="*" element={<Navigate to="/catalog" replace />} />
    </Routes>
  );
}

export function App() {
  return (
    <CustomerProvider>
      <AppRoutes />
    </CustomerProvider>
  );
}
