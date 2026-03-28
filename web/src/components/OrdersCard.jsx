import { useState, useEffect } from "react";
import { Package, Clock, MapPin, AlertCircle, CheckCircle } from "lucide-react";
import getOrders from "@/actions/get-orders";
import useAuth from "@/hooks/use-auth";
import {
  getLatestStatusTitle,
  getLatestStatusMessage,
} from "@/lib/status-utils";

const statusColors = {
  pending_confirmation: "bg-orange-50 border-orange-200 text-orange-800",
  pending: "bg-yellow-50 border-yellow-200 text-yellow-800",
  processing: "bg-blue-50 border-blue-200 text-blue-800",
  shipped: "bg-purple-50 border-purple-200 text-purple-800",
  delivered: "bg-green-50 border-green-200 text-green-800",
};

const deliveryStatusIcons = {
  pending_confirmation: <AlertCircle className="w-4 h-4" />,
  pending: <Clock className="w-4 h-4" />,
  processing: <Package className="w-4 h-4" />,
  shipped: <Package className="w-4 h-4" />,
  delivered: <CheckCircle className="w-4 h-4" />,
};

const OrdersCard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    if (!user) {
      setLoading(false);
      return;
    }

    getOrders()
      .then((data) => {
        setOrders(data);
        // Filter for non-delivered and non-cancelled orders (include pending_confirmation for display)
        const active = data.filter(
          (order) =>
            order.delivery_status !== "delivered" &&
            order.delivery_status !== "cancelled",
        );
        setActiveOrders(active);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, [user]);

  // Polling: use stable 15-second interval
  // Avoids constant interval resets that were causing excessive queries
  useEffect(() => {
    if (!user) return;

    // Poll every 15 seconds - reasonable for both pending confirmation and delivery tracking
    const interval = setInterval(fetchOrders, 15000);

    return () => clearInterval(interval);
  }, [user]);

  // Don't show if no active orders
  if (!loading && activeOrders.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <div className="mb-6 bg-white rounded-xl border border-gray-200 p-4 md:p-6 animate-pulse">
        <div className="h-12 bg-gray-200 rounded mb-4" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 space-y-3">
      {activeOrders.map((order) => {
        const total =
          order.orderItems?.reduce(
            (sum, item) =>
              sum + (item.product?.price ?? 0) * (item.quantity ?? 1),
            0,
          ) || 0;

        const statusBg =
          order.order_status === "pending_confirmation"
            ? statusColors.pending_confirmation
            : statusColors[order.delivery_status] || statusColors.pending;
        const statusIcon =
          order.order_status === "pending_confirmation"
            ? deliveryStatusIcons.pending_confirmation
            : deliveryStatusIcons[order.delivery_status] ||
              deliveryStatusIcons.pending;

        return (
          <div
            key={order.id}
            className={`border-2 rounded-xl p-4 md:p-5 transition-all ${statusBg}`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex-shrink-0">{statusIcon}</div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm md:text-base capitalize">
                    {getLatestStatusTitle(order)}
                  </h3>
                  <p className="text-xs md:text-sm opacity-75 mt-1">
                    Order #{order.id?.slice(-8).toUpperCase() || "N/A"}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-sm md:text-base">
                  ₱{total.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Items Summary */}
            {order.orderItems && order.orderItems.length > 0 && (
              <div className="mb-3 mt-3 pt-3 border-t border-current opacity-50">
                <p className="text-xs md:text-sm font-medium mb-2">Items:</p>
                <div className="flex flex-wrap gap-2">
                  {order.orderItems.slice(0, 3).map((item, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-black bg-opacity-10 px-2 py-1 rounded-full"
                    >
                      {item.product?.name || "Item"} ×{item.quantity || 1}
                    </span>
                  ))}
                  {order.orderItems.length > 3 && (
                    <span className="text-xs bg-black bg-opacity-10 px-2 py-1 rounded-full">
                      +{order.orderItems.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Address */}
            {order.address && (
              <div className="flex items-start gap-2 text-xs md:text-sm mt-3">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="opacity-75">{order.address}</span>
              </div>
            )}

            {/* Status Message */}
            {order.statusMessage && (
              <div className="mt-3 flex items-start gap-2 text-xs md:text-sm bg-black bg-opacity-5 p-2 rounded">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{order.statusMessage}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrdersCard;
