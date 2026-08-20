import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/catalog", label: "Catalog" },
  { to: "/events", label: "Events" },
  { to: "/account", label: "My Account" },
];

export function NavBar() {
  return (
    <header className="sticky top-0 z-10 border-b border-brand-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-8 px-6 py-4">
        <NavLink to="/catalog" className="text-lg font-semibold tracking-tight text-brand-800">
          Riverside Books
        </NavLink>
        <nav className="flex flex-1 gap-1">
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
        </nav>
      </div>
    </header>
  );
}
