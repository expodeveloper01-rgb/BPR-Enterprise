import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SellerLayout from "./SellerLayout";
import { useSeller } from "@/context/SellerContext";
import apiClient from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  ShoppingBag,
  Star,
  Archive,
  ArrowRight,
  DollarSign,
  Clock,
  AlertCircle,
  Zap,
  RefreshCw,
} from "lucide-react";

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}
    >
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold text-neutral-800">{value ?? "—"}</p>
    </div>
  </div>
);

const StatCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
    <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
      <div className="h-6 bg-gray-200 rounded animate-pulse w-12" />
    </div>
  </div>
);

const SellerDashboard = () => {
  const { selectedKitchenId } = useSeller();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchStats = () => {
    if (!selectedKitchenId) {
      setStats(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    apiClient
      .get(`/admin/stats?kitchen=${selectedKitchenId}`)
      .then((r) => setStats(r.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();

    // Auto-refresh stats every 30 seconds for real-time updates
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, [selectedKitchenId, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <SellerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Overview of your store
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh stats"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Stats - Products & Orders */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatCard
                label="Total Products"
                value={stats?.totalProducts}
                icon={Package}
                color="bg-blue-50 text-blue-600"
              />
              <StatCard
                label="Featured"
                value={stats?.featuredProducts}
                icon={Star}
                color="bg-amber-50 text-amber-600"
              />
              <StatCard
                label="Total Orders"
                value={stats?.totalOrders}
                icon={ShoppingBag}
                color="bg-green-50 text-green-600"
              />
              <StatCard
                label="Paid Orders"
                value={stats?.paidOrders}
                icon={ShoppingBag}
                color="bg-emerald-50 text-emerald-600"
              />
            </>
          )}
        </div>

        {/* Stats - Earnings & Revenue */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatCard
                label="Gross Earnings"
                value={`₱${(stats?.totalRevenue || 0).toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
                icon={DollarSign}
                color="bg-blue-50 text-blue-600"
              />
              <StatCard
                label="Net Earnings"
                value={`₱${(stats?.netRevenue || 0).toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
                icon={DollarSign}
                color="bg-green-50 text-green-600"
              />
              <StatCard
                label="Rider Commission Deducted"
                value={`₱${(stats?.riderCommissionAmount || 0).toLocaleString(
                  "en-PH",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  },
                )}`}
                icon={AlertCircle}
                color="bg-red-50 text-red-600"
              />
              <StatCard
                label="Rider Commission Rate"
                value={`${(stats?.kitchenSettings?.riderCommissionRate || 15).toFixed(1)}%`}
                icon={Zap}
                color="bg-purple-50 text-purple-600"
              />
            </>
          )}
        </div>

        {/* Stats - Pending Revenue */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatCard
                label="Pending Revenue (Gross)"
                value={`₱${(stats?.pendingRevenue || 0).toLocaleString(
                  "en-PH",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  },
                )}`}
                icon={Clock}
                color="bg-yellow-50 text-yellow-600"
              />
              <StatCard
                label="Pending Revenue (Net)"
                value={`₱${(stats?.netPendingRevenue || 0).toLocaleString(
                  "en-PH",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  },
                )}`}
                icon={Clock}
                color="bg-yellow-100 text-yellow-700"
              />
              <StatCard
                label="Pending Commission"
                value={`₱${(stats?.pendingCommissionAmount || 0).toLocaleString(
                  "en-PH",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  },
                )}`}
                icon={AlertCircle}
                color="bg-orange-50 text-orange-600"
              />
              <StatCard
                label="Pending Confirmation"
                value={stats?.pendingOrders}
                icon={AlertCircle}
                color="bg-orange-100 text-orange-700"
              />
            </>
          )}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/seller/products"
            className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow group"
          >
            <div>
              <p className="font-semibold text-neutral-800">Manage Products</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Add, edit or archive menu items
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
          </Link>
          <Link
            to="/seller/orders"
            className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow group"
          >
            <div>
              <p className="font-semibold text-neutral-800">View Orders</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                See all customer orders
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
          </Link>
        </div>

        {/* Recent orders */}
        {stats?.recentOrders?.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-neutral-800 mb-4">
              Recent Orders
            </h2>
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-neutral-700">
                      Order #{order.id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.orderItems.length} item
                      {order.orderItems.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${order.isPaid ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}
                  >
                    {order.isPaid ? "Paid" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SellerLayout>
  );
};

export default SellerDashboard;
