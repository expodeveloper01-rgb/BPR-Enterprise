import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

const MainNav = ({ className, scrolled }) => {
  const { pathname } = useLocation();
  const isUncleBrew = pathname.startsWith("/uncle-brew");
  const isDiomedes = pathname.startsWith("/diomedes");

  // Build routes based on current brand
  const routes = isUncleBrew
    ? [
        { to: "/uncle-brew", label: "Home" },
        { to: "/uncle-brew/menu", label: "Menu" },
        { to: "/orders", label: "Orders" },
        { to: "/uncle-brew/about", label: "About" },
        { to: "/uncle-brew/contact", label: "Contact" },
      ]
    : isDiomedes
      ? [
          { to: "/diomedes", label: "Home" },
          { to: "/diomedes/menu", label: "Menu" },
          { to: "/orders", label: "Orders" },
          { to: "/diomedes/about", label: "About" },
          { to: "/diomedes/contact", label: "Contact" },
        ]
      : [
          { to: "/", label: "Home" },
          { to: "/browse-stores", label: "Browse Stores" },
          { to: "/about", label: "About" },
          { to: "/contact", label: "Contact" },
        ];

  return (
    <nav
      className={cn(
        "flex items-center justify-center space-x-4 lg:space-x-12",
        className,
      )}
    >
      {routes.map((route) => {
        const active = pathname === route.to;
        const isWhite = !scrolled && route.onDark;
        return (
          <Link
            to={route.to}
            key={route.to}
            className={cn(
              "text-base font-medium transition-colors",
              isWhite
                ? active
                  ? "text-white border-b-white border-b-[2px] font-bold [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]"
                  : "text-white hover:text-white/70 [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]"
                : active
                  ? "text-neutral-900 border-b-neutral-900 border-b-[2px] font-bold"
                  : "text-neutral-700 hover:text-neutral-500",
            )}
          >
            {route.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default MainNav;
