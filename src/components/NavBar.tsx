import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { useCustomer } from "@/lib/customer-context";

const LINKS = [
  { to: "/catalog", label: "Catalog" },
  { to: "/events", label: "Events" },
];

export function NavBar() {
  const { user, signOut: signOutAuth } = useAuth();
  const { signOut: signOutCustomer } = useCustomer();
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
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-700 text-white"
                    : "text-stone-600 hover:bg-brand-50 hover:text-brand-800"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {user && (
            <NavLink
              to="/account"
              className={({ isActive }) =>
                `rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-700 text-white"
                    : "text-stone-600 hover:bg-brand-50 hover:text-brand-800"
                }`
              }
            >
              My Account
            </NavLink>
          )}
        </nav>
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
