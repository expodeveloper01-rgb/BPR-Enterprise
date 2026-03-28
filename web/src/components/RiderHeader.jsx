import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useRiderAuth from "@/hooks/use-rider-auth";
import {
  LogOut,
  User,
  Home,
  Package,
  Clock,
  FileText,
  Menu,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

const RiderHeader = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useRiderAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/rider/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const navItems = [
    {
      path: "/rider",
      label: "Dashboard",
      icon: Home,
      exact: true,
    },
    {
      path: "/rider/deliveries/pending",
      label: "Available Orders",
      icon: Package,
    },
    {
      path: "/rider/deliveries/active",
      label: "Active Deliveries",
      icon: Clock,
    },
    {
      path: "/rider/deliveries/history",
      label: "History",
      icon: FileText,
    },
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 md:px-12 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer flex-shrink-0"
            onClick={() => navigate("/rider")}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-bold text-neutral-900">Rider Portal</p>
              <p className="text-xs text-neutral-600">Delivery Management</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 ml-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path, item.exact);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-neutral-700 hover:bg-gray-50",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            {user && (
              <>
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-neutral-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-neutral-600">{user.email}</p>
                </div>
                <button
                  onClick={() => navigate("/rider/profile")}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Profile"
                >
                  <User className="w-5 h-5 text-neutral-700" />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 text-red-600" />
                </button>
              </>
            )}

            {/* Hamburger Menu on Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-neutral-700" />
              ) : (
                <Menu className="w-5 h-5 text-neutral-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 mt-3 pt-3">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path, item.exact);
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full",
                      active
                        ? "bg-blue-50 text-blue-700"
                        : "text-neutral-700 hover:bg-gray-50",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default RiderHeader;
