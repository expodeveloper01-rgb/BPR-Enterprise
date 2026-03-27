import { cn } from "@/lib/utils";
import Container from "@/components/container";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import CartActionButton from "./cart-action";
import useAuth from "@/hooks/use-auth";
import useCart from "@/hooks/use-carts";
import { useStore } from "@/context/StoreContext";
import { Menu, X } from "lucide-react";

const DiomedesHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const { removeAll: clearCart } = useCart();
  const { clearStore } = useStore();
  const isSignedIn = !!user;
  const navigate = useNavigate();

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
    navigate("/");
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white shadow-md"
          : "bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100",
      )}
    >
      <Container>
        <div className="relative px-4 md:px-12 flex h-16 items-center justify-between">
          <Link
            to="/diomedes"
            className="flex items-center shrink-0"
            onClick={() => setMobileOpen(false)}
          >
            <img
              src="/assets/img/diomedes-logo.png"
              alt="Diomedes Bakeshop"
              className="w-24 md:w-28"
            />
          </Link>

          {/* Desktop nav - centered */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            <nav className="flex items-center justify-center space-x-4 lg:space-x-8">
              <Link
                to="/diomedes"
                className="text-base font-medium text-neutral-700 hover:text-amber-600 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/diomedes/menu"
                className="text-base font-medium text-neutral-700 hover:text-amber-600 transition-colors"
              >
                Shop
              </Link>
              <Link
                to="/orders"
                className="text-base font-medium text-neutral-700 hover:text-amber-600 transition-colors"
              >
                Orders
              </Link>
              <Link
                to="/diomedes/about"
                className="text-base font-medium text-neutral-700 hover:text-amber-600 transition-colors"
              >
                About
              </Link>
              <Link
                to="/diomedes/contact"
                className="text-base font-medium text-neutral-700 hover:text-amber-600 transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <CartActionButton scrolled={scrolled} />
            {isSignedIn ? (
              <>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="w-9 h-9 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-sm uppercase transition-all hover:bg-amber-700 focus:outline-none ring-2 ring-offset-2 ring-amber-400/50"
                    aria-label="Account menu"
                  >
                    {user.name?.[0] ?? "U"}
                  </button>

                  {dropdownOpen && (
                    <div className="absolute top-12 right-0 bg-white shadow-2xl rounded-xl py-2 min-w-[180px] z-50 border border-amber-100 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-amber-100">
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
                          className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-amber-50 transition-colors font-medium"
                        >
                          Dashboard
                        </Link>
                      )}
                      <Link
                        to="/orders"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-amber-50 transition-colors"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={() => {
                          navigate("/browse-stores");
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-amber-50 transition-colors"
                      >
                        Browse Stores
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-amber-100 mt-2 font-medium"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/sign-in">
                  <Button
                    variant="ghost"
                    className="hidden md:inline text-neutral-700 hover:text-amber-600"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/sign-up">
                  <Button className="rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-md hover:bg-amber-100 transition-colors"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-amber-100 shadow-lg">
          <nav className="flex flex-col px-6 py-4 gap-1">
            {[
              { to: "/diomedes", label: "Home" },
              { to: "/diomedes/menu", label: "Menu" },
              { to: "/orders", label: "Orders" },
              { to: "/diomedes/about", label: "About" },
              { to: "/diomedes/contact", label: "Contact" },
            ]
              .concat(
                user?.role === "admin"
                  ? [{ to: "/seller", label: "Dashboard" }]
                  : [],
              )
              .map((route) => (
                <Link
                  to={route.to}
                  key={route.to}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-md text-neutral-700 hover:bg-amber-50 transition-colors font-medium"
                >
                  {route.label}
                </Link>
              ))}
            {!isSignedIn && (
              <div className="flex gap-2 mt-4 pt-4 border-t border-amber-100">
                <Link to="/sign-in" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-amber-300 text-amber-600 hover:bg-amber-50"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/sign-up" className="flex-1">
                  <Button
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default DiomedesHeader;
