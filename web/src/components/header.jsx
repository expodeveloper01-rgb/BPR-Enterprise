import { cn } from "@/lib/utils";
import Container from "@/components/container";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MainNav from "@/components/main-nav";
import { useEffect, useRef, useState } from "react";
import CartActionButton from "./cart-action";
import useAuth from "@/hooks/use-auth";
import logo from "/assets/img/uncle-brew.png";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const isSignedIn = !!user;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const transparent = isHome && !scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSignOut = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || !isHome ? "bg-white shadow-md" : "bg-transparent",
      )}
    >
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-12 flex h-16 items-center">
          <Link to="/" className="flex items-center shrink-0" onClick={() => setMobileOpen(false)}>
            <img src={logo} alt="logo" className="w-24 md:w-28" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:block">
            <MainNav scrolled={!transparent} />
          </div>

          <div className="ml-auto flex items-center gap-2 md:gap-3">
            <CartActionButton scrolled={scrolled} />
            {isSignedIn ? (
              <>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm uppercase transition-all focus:outline-none ring-2 ring-offset-2 ring-black/20"
                    aria-label="Account menu"
                  >
                    {user.name?.[0] ?? "U"}
                  </button>

                  {dropdownOpen && (
                    <div className="absolute top-12 right-0 bg-white shadow-2xl rounded-xl py-2 min-w-[180px] z-50 border border-gray-100 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-neutral-700 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                      {user.role === "admin" && (
                        <Link
                          to="/seller"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-gray-50 transition-colors font-medium"
                        >
                          Dashboard
                        </Link>
                      )}
                      <Link
                        to="/orders"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-gray-50 transition-colors"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/sign-in" className="hidden md:block">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "rounded-full text-sm font-medium transition-all",
                      transparent
                        ? "text-white hover:bg-white/10"
                        : "text-neutral-700 hover:bg-gray-100",
                    )}
                  >
                    Sign in
                  </Button>
                </Link>
                <Link to="/sign-up" className="hidden md:block">
                  <Button
                    size="sm"
                    className={cn(
                      "rounded-full text-sm font-medium transition-all",
                      transparent
                        ? "bg-white text-black hover:bg-white/90"
                        : "bg-black text-white hover:bg-black/80",
                    )}
                  >
                    Sign up
                  </Button>
                </Link>
                {/* Mobile hamburger */}
                <button
                  className="md:hidden p-2 rounded-lg transition-colors"
                  onClick={() => setMobileOpen((o) => !o)}
                  aria-label="Toggle menu"
                >
                  {mobileOpen
                    ? <X className="w-6 h-6 text-neutral-800" />
                    : <Menu className="w-6 h-6 text-neutral-800" />
                  }
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="flex flex-col px-6 py-4 gap-1">
            {[
              { to: "/", label: "Home" },
              { to: "/menu", label: "Menu" },
              { to: "/orders", label: "Orders" },
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
              ...(user?.role === "admin" ? [{ to: "/seller", label: "Dashboard" }] : []),
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className="py-3 text-base font-medium text-neutral-700 border-b border-gray-100 last:border-0 hover:text-black transition-colors"
              >
                {label}
              </Link>
            ))}
            <div className="flex gap-3 pt-4">
              <Link to="/sign-in" onClick={() => setMobileOpen(false)} className="flex-1">
                <Button variant="outline" className="w-full rounded-full">Sign in</Button>
              </Link>
              <Link to="/sign-up" onClick={() => setMobileOpen(false)} className="flex-1">
                <Button className="w-full rounded-full bg-black text-white">Sign up</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
