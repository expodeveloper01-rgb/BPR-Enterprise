import { cn } from "@/lib/utils";
import Container from "@/components/container";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MainNav from "@/components/main-nav";
import { useEffect, useRef, useState } from "react";
import CartActionButton from "./cart-action";
import useAuth from "@/hooks/use-auth";
import useCart from "@/hooks/use-carts";
import { useStore } from "@/context/StoreContext";
import { Menu, X, Store } from "lucide-react";

const BRANDS = {
  belapari: {
    id: "belapari",
    name: "BeLaPaRi Ventures",
    logo: "/assets/img/belapari-icon.png",
  },
  "uncle-brew": {
    id: "uncle-brew",
    name: "Uncle Brew",
    logo: "/assets/img/uncle-brew.png",
  },
  diomedes: {
    id: "diomedes",
    name: "Diomedes Bakeshop",
    logo: "/assets/img/diomedes-logo.png",
  },
};

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const { removeAll: clearCart } = useCart();
  const { activeStore, clearStore } = useStore();
  const isSignedIn = !!user;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const transparent = isHome && !scrolled;
  const isUncleBrew = pathname.startsWith("/uncle-brew");
  const isDiomedes = pathname.startsWith("/diomedes");

  // Determine brand directly from pathname
  const currentBrand = pathname.startsWith("/uncle-brew")
    ? BRANDS["uncle-brew"]
    : pathname.startsWith("/diomedes")
      ? BRANDS["diomedes"]
      : BRANDS.belapari;

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
    clearCart();
    clearStore();
    logout();
    setDropdownOpen(false);
    navigate("/"); // Redirect to BeLaPaRi homepage
  };

  // Determine logo link based on current brand
  const logoLink =
    currentBrand.id === "belapari"
      ? "/"
      : currentBrand.id === "uncle-brew"
        ? "/uncle-brew"
        : "/diomedes";

  // Determine orders link based on current brand
  const ordersLink =
    currentBrand.id === "uncle-brew"
      ? "/uncle-brew/orders"
      : currentBrand.id === "diomedes"
        ? "/diomedes/orders"
        : "/uncle-brew/orders"; // Default to uncle-brew orders for belapari

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white shadow-md"
          : isHome
            ? "bg-transparent"
            : "bg-white",
      )}
    >
      <Container>
        <div className="relative px-4 md:px-12 flex h-16 items-center justify-between">
          <Link
            to={logoLink}
            className="flex items-center shrink-0"
            onClick={() => setMobileOpen(false)}
          >
            <img
              key={currentBrand.id}
              src={currentBrand.logo}
              alt={currentBrand.name}
              className="w-16 md:w-20"
            />
          </Link>

          {/* Desktop nav - centered */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            <MainNav scrolled={!transparent} />
          </div>

          <div className="flex items-center gap-2 md:gap-3">
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
                        to={ordersLink}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-gray-50 transition-colors"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={() => {
                          navigate("/stores");
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-gray-50 transition-colors border-t border-gray-100 mt-2 pt-2"
                      >
                        <Store size={16} />
                        Switch Store
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
                {/* Mobile hamburger for authenticated users */}
                <button
                  className="md:hidden p-2 rounded-lg transition-colors"
                  onClick={() => setMobileOpen((o) => !o)}
                  aria-label="Toggle menu"
                >
                  {mobileOpen ? (
                    <X className="w-6 h-6 text-neutral-800" />
                  ) : (
                    <Menu className="w-6 h-6 text-neutral-800" />
                  )}
                </button>
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
                        ? "text-neutral-900 hover:bg-black/5"
                        : "text-neutral-700 hover:bg-gray-100",
                    )}
                  >
                    Sign in
                  </Button>
                </Link>
                <Link to="/sign-up" className="hidden md:block">
                  <Button
                    size="sm"
                    className="rounded-full text-sm font-medium transition-all bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white hover:from-pink-600 hover:to-fuchsia-700"
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
                  {mobileOpen ? (
                    <X className="w-6 h-6 text-neutral-800" />
                  ) : (
                    <Menu className="w-6 h-6 text-neutral-800" />
                  )}
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
            {(isUncleBrew
              ? [
                  { to: "/uncle-brew", label: "Home" },
                  { to: "/uncle-brew/menu", label: "Menu" },
                  { to: "/uncle-brew/orders", label: "Orders" },
                  { to: "/uncle-brew/about", label: "About" },
                  { to: "/uncle-brew/contact", label: "Contact" },
                ]
              : isDiomedes
                ? [
                    { to: "/diomedes", label: "Home" },
                    { to: "/diomedes/menu", label: "Menu" },
                    { to: "/diomedes/orders", label: "Orders" },
                    { to: "/diomedes/about", label: "About" },
                    { to: "/diomedes/contact", label: "Contact" },
                  ]
                : [
                    { to: "/", label: "Home" },
                    { to: "/stores", label: "Browse Stores" },
                    { to: "/about", label: "About" },
                    { to: "/contact", label: "Contact" },
                  ]
            )
              .concat(
                user?.role === "admin"
                  ? [{ to: "/seller", label: "Dashboard" }]
                  : [],
              )
              .map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-base font-medium text-neutral-700 border-b border-gray-100 last:border-0 hover:text-black transition-colors"
                >
                  {label}
                </Link>
              ))}
            {!isSignedIn && (
              <div className="flex gap-3 pt-4">
                <Link
                  to="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full rounded-full">
                    Sign in
                  </Button>
                </Link>
                <Link
                  to="/sign-up"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1"
                >
                  <Button className="w-full rounded-full bg-black text-white">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
            {isSignedIn && (
              <button
                onClick={() => {
                  handleSignOut();
                  setMobileOpen(false);
                }}
                className="w-full mt-4 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100 pt-4"
              >
                Sign out
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
