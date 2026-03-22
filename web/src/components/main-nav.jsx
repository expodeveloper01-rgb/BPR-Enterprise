import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

const MainNav = ({ className, scrolled }) => {
  const { pathname } = useLocation();

  const routes = [
    { to: "/", label: "Home" },
    { to: "/menu", label: "Menu" },
    { to: "/orders", label: "Orders" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <div className="ml-auto">
      <nav
        className={cn(
          "flex items-center space-x-4 lg:space-x-12 pl-6",
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
    </div>
  );
};

export default MainNav;
