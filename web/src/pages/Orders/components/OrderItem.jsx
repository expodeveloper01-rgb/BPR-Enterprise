import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";
import { getLatestStatusTitle } from "@/lib/status-utils";

const statusColors = {
  processing: "bg-orange-50 text-orange-700 border-orange-200",
  pending: "bg-gray-50 text-gray-700 border-gray-200",
  "pickup-pending": "bg-blue-50 text-blue-700 border-blue-200",
  "in-transit": "bg-yellow-50 text-yellow-700 border-yellow-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  confirmed: "bg-green-50 text-green-700 border-green-200",
  pending_confirmation: "bg-orange-50 text-orange-700 border-orange-200",
};

const OrderItem = ({ order, onViewDetail }) => {
  const handleRefresh = () => window.location.reload();

  const total = order.orderItems.reduce(
    (sum, item) => sum + (item.product?.price ?? 0) * (item.quantity ?? 1),
    0,
  );

  return (
    <div
      onClick={() => onViewDetail?.(order)}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Top row: Product images on left, Order ID on right */}
      <div className="flex items-start justify-between gap-3 mb-3">
        {/* Images */}
        <div className="flex items-center gap-2">
          {order.orderItems.slice(0, 3).map((item, i) => (
            <div
              key={item.id}
              className={cn(
                "w-14 h-14 rounded-lg bg-gray-50 overflow-hidden border border-gray-100",
                i > 0 && "-ml-2",
              )}
            >
              <img
                src={item.images?.[0]?.url}
                alt={item.product?.name}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
          {order.orderItems.length > 3 && (
            <span className="text-xs font-medium text-neutral-600 px-2 py-1 bg-neutral-50 rounded">
              +{order.orderItems.length - 3}
            </span>
          )}
        </div>

        {/* Order ID - Top right */}
        <div className="text-xs font-semibold text-neutral-600 bg-neutral-50 px-2.5 py-1.5 rounded-lg whitespace-nowrap">
          #
          {typeof order.id === "string"
            ? order.id.slice(-8).toUpperCase()
            : order.id}
        </div>
      </div>

      {/* Product names and item count - beside images */}
      <div className="mb-3">
        <p className="text-sm font-semibold text-neutral-800 line-clamp-2">
          {order.orderItems
            .map((i) =>
              i.size ? `${i.product?.name} (${i.size.name})` : i.product?.name,
            )
            .join(", ")}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {order.orderItems.length}{" "}
          {order.orderItems.length === 1 ? "item" : "items"}
        </p>
      </div>

      {/* Total price */}
      <div className="mb-3 pb-3 border-b border-gray-100">
        <p className="text-sm font-bold text-neutral-800">
          ₱{total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
        </p>
      </div>

      {/* Latest status update from history */}
      {order.statusHistory && order.statusHistory.length > 0 && (
        <div className="mb-3 p-2.5 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-700">
            <span className="font-semibold">Latest Update:</span>{" "}
            {order.statusHistory[order.statusHistory.length - 1]?.title ||
              order.statusHistory[order.statusHistory.length - 1]?.message ||
              order.statusHistory[order.statusHistory.length - 1]?.status}
          </p>
          {order.statusHistory[order.statusHistory.length - 1]?.message && (
            <p className="text-xs text-blue-600 mt-1">
              {order.statusHistory[order.statusHistory.length - 1]?.message}
            </p>
          )}
          {order.statusHistory[order.statusHistory.length - 1]?.timestamp && (
            <p className="text-xs text-blue-600 mt-1">
              {new Date(
                order.statusHistory[order.statusHistory.length - 1].timestamp,
              ).toLocaleString("en-PH", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                timeZone: "Asia/Manila",
                hour12: true,
              })}
            </p>
          )}
        </div>
      )}

      {/* Status row: Order status, Payment status, and Refresh */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Order status badge */}
          <span
            className={cn(
              "text-xs font-semibold px-2.5 py-1 rounded-full border",
              statusColors[order.delivery_status?.toLowerCase()] ||
                statusColors[order.order_status?.toLowerCase()] ||
                "bg-gray-100 text-gray-600 border-gray-200",
            )}
          >
            {getLatestStatusTitle(order)}
          </span>

          {/* Payment status */}
          <span
            className={cn(
              "text-xs font-semibold px-2.5 py-1 rounded-full border",
              order.isPaid
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-red-50 text-red-600 border-red-200",
            )}
          >
            {order.isPaid ? "Paid" : "Unpaid"}
          </span>
        </div>

        {/* Refresh */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRefresh();
          }}
          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-muted-foreground hover:text-neutral-700 hover:border-neutral-300 transition flex-shrink-0"
          title="Refresh status"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default OrderItem;
