import { useNavigate } from "react-router-dom";
import useRiderAuth from "@/hooks/use-rider-auth";
import { LogOut, User, Home } from "lucide-react";
import toast from "react-hot-toast";

const RiderHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useRiderAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/rider/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-4">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/rider")}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900">Rider Portal</p>
              <p className="text-xs text-neutral-600">Delivery Management</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <>
                <div className="hidden md:block">
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default RiderHeader;
