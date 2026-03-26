import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SellerLayout from "./SellerLayout";
import { useSeller } from "@/context/SellerContext";
import apiClient from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, ShoppingBag, Star, Archive, ArrowRight } from "lucide-react";

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

  useEffect(() => {
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
  }, [selectedKitchenId]);

  return (
    <SellerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of your store
          </p>
        </div>

        {/* Stats */}
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
                label="Archived"
                value={stats?.archivedProducts}
                icon={Archive}
                color="bg-gray-100 text-gray-500"
              />
              <StatCard
                label="Total Orders"
                value={stats?.totalOrders}
                icon={ShoppingBag}
                color="bg-green-50 text-green-600"
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
