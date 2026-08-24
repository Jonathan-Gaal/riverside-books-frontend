import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { useCustomer } from "@/lib/customer-context";
import { useCart } from "@/lib/cart-context";

const LINKS = [
  { to: "/catalog", label: "Catalog" },
  { to: "/events", label: "Events" },
  { to: "/favorites", label: "Favorites" },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
    isActive ? "bg-brand-700 text-white" : "text-stone-600 hover:bg-brand-50 hover:text-brand-800"
  }`;

export function NavBar() {
  const { user, signOut: signOutAuth } = useAuth();
  const { signOut: signOutCustomer } = useCustomer();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  async function handleLogout() {
    // Auth first so onAuthStateChanged fires and guards are ready, then clear the local
    // loyalty record from this device.
    await signOutAuth();
    signOutCustomer();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-10 border-b border-brand-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-8 px-6 py-4">
        <NavLink to="/catalog" className="text-lg font-semibold tracking-tight text-brand-800">
          Riverside Books
        </NavLink>
        <nav className="flex flex-1 items-center gap-1">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              {link.label}
            </NavLink>
          ))}
          {user && (
            <NavLink to="/orders" className={navLinkClass}>
              Orders
            </NavLink>
          )}
          {user && (
            <NavLink to="/account" className={navLinkClass}>
              My Account
            </NavLink>
          )}
        </nav>
        <NavLink
          to="/cart"
          aria-label={`Cart${itemCount > 0 ? ` (${itemCount} item${itemCount === 1 ? "" : "s"})` : ""}`}
          className={({ isActive }) =>
            `relative flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
              isActive ? "bg-brand-700 text-white" : "text-stone-600 hover:bg-brand-50 hover:text-brand-800"
            }`
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <circle cx="9" cy="20" r="1.4" />
            <circle cx="18" cy="20" r="1.4" />
            <path d="M2.5 3.5h2l2.2 11.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.2L21 7H6" />
          </svg>
          {itemCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-xs font-semibold text-white">
              {itemCount}
            </span>
          )}
        </NavLink>
        {user ? (
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="rounded-lg border border-stone-300 px-4 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-50"
          >
            Log out
          </button>
        ) : (
          <NavLink
            to="/login"
            className="rounded-lg bg-brand-700 px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-800"
          >
            Log in
          </NavLink>
        )}
      </div>
    </header>
  );
}
