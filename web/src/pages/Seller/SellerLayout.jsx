import { useEffect, useState } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import useAuth from "@/hooks/use-auth";
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut, ChevronRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/seller", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/seller/products", label: "Products", icon: Package },
  { to: "/seller/orders", label: "Orders", icon: ShoppingBag },
  { to: "/seller/users", label: "Users", icon: Users },
];

const SidebarContent = ({ pathname, user, logout, onNavClick }) => (
  <div className="flex flex-col h-full">
    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
      <span className="font-bold text-lg text-neutral-800 tracking-tight">
        Uncle Brew <span className="text-amber-600">Seller</span>
      </span>
    </div>
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {navItems.map(({ to, label, icon: Icon, exact }) => {
        const active = exact ? pathname === to : pathname.startsWith(to);
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavClick}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              active
                ? "bg-black text-white"
                : "text-neutral-600 hover:bg-gray-100 hover:text-neutral-800"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
    <div className="px-3 py-4 border-t border-gray-100">
      <div className="px-3 py-2 mb-2">
        <p className="text-xs font-semibold text-neutral-700 truncate">{user.name}</p>
        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
      </div>
      <button
        onClick={logout}
        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Sign out
      </button>
    </div>
  </div>
);

const SellerLayout = ({ children }) => {
  const { user, token, logout, refreshUser } = useAuth();
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!token) { setChecking(false); return; }
    refreshUser(token).finally(() => setChecking(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return <Navigate to="/sign-in" replace />;
  if (checking) return null; // wait for refresh before checking role
  if (user.role !== "admin") return <Navigate to="/" replace />;

  const pageLabel = pathname === "/seller"
    ? "Dashboard"
    : pathname.replace(/^\/seller\//, "").replace(/\/.*$/, "");

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — desktop static, mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-100 transition-transform duration-300 md:static md:translate-x-0 md:w-60 md:shrink-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent
          pathname={pathname}
          user={user}
          logout={logout}
          onNavClick={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-3 md:py-4 flex items-center gap-3 text-sm text-muted-foreground sticky top-0 z-10">
          {/* Hamburger — mobile only */}
          <button
            className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-neutral-700"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/" className="hover:text-neutral-800 transition-colors hidden sm:inline">Store</Link>
          <ChevronRight className="w-3.5 h-3.5 hidden sm:inline" />
          <span className="text-neutral-800 font-medium capitalize">{pageLabel}</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default SellerLayout;

