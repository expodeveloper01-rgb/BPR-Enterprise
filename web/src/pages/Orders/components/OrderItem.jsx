import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";

const statusColors = {
  Delivering: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Processing: "bg-orange-50 text-orange-700 border-orange-200",
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

const OrderItem = ({ order }) => {
  const handleRefresh = () => window.location.reload();

  const total = order.orderItems.reduce(
    (sum, item) => sum + Number(item.price ?? 0),
    0,
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Product images */}
        <div className="flex items-center gap-2 shrink-0">
          {order.orderItems.slice(0, 3).map((item, i) => (
            <div
              key={item.id}
              className={cn(
                "w-14 h-14 rounded-xl bg-gray-50 overflow-hidden border border-gray-100",
                i > 0 && "-ml-4",
              )}
            >
              <img
                src={item.images?.[0]?.url}
                alt={item.name}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
          {order.orderItems.length > 3 && (
            <span className="text-xs text-muted-foreground ml-1">
              +{order.orderItems.length - 3} more
            </span>
          )}
        </div>

        {/* Item names */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-neutral-800 truncate">
            {order.orderItems.map((i) => i.name).join(", ")}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {order.orderItems.length} {order.orderItems.length === 1 ? "item" : "items"}
          </p>
        </div>

        {/* Order status badge */}
        <span
          className={cn(
            "shrink-0 text-xs font-semibold px-3 py-1 rounded-full border",
            statusColors[order.order_status] ??
              "bg-gray-100 text-gray-600 border-gray-200",
          )}
        >
          {order.order_status}
        </span>

        {/* Payment status */}
        <span
          className={cn(
            "shrink-0 text-xs font-semibold px-3 py-1 rounded-full border",
            order.isPaid
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-600 border-red-200",
          )}
        >
          {order.isPaid ? "Paid" : "Unpaid"}
        </span>

        {/* Refresh */}
        <button
          onClick={handleRefresh}
          className="shrink-0 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-muted-foreground hover:text-neutral-700 hover:border-neutral-300 transition"
          title="Refresh status"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default OrderItem;
