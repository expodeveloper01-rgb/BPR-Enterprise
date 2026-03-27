import { useEffect, useState } from "react";
import SellerLayout from "../SellerLayout";
import { useSeller } from "@/context/SellerContext";
import apiClient from "@/lib/api-client";
import toast from "react-hot-toast";
import { ShoppingBag } from "lucide-react";
import OrderDetail from "./OrderDetail";

const SellerOrders = () => {
  const { selectedKitchenId } = useSeller();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = () => {
    if (!selectedKitchenId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    apiClient
      .get(`/admin/orders?kitchen=${selectedKitchenId}`)
      .then((r) => setOrders(r.data))
      .catch(() => {
        toast.error("Failed to load orders");
        setOrders([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();

    // Refetch every 6 seconds to show real-time status updates
    const interval = setInterval(fetchOrders, 6000);

    // Refetch when page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchOrders();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [selectedKitchenId]);

  return (
    <SellerLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Orders</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {orders.length} total orders
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden overflow-x-auto">
          {loading ? (
            <div className="text-center py-16 text-muted-foreground">
              Loading...
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-muted-foreground text-sm">No orders yet</p>
            </div>
          ) : (
            <table className="w-full text-sm min-w-max">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-4 py-3 font-medium text-neutral-600">
                    Order ID
                  </th>
                  <th className="px-4 py-3 font-medium text-neutral-600 hidden md:table-cell">
                    Customer
                  </th>
                  <th className="px-4 py-3 font-medium text-neutral-600">
                    Items
                  </th>
                  <th className="px-4 py-3 font-medium text-neutral-600">
                    Order Status
                  </th>
                  <th className="px-4 py-3 font-medium text-neutral-600">
                    Payment
                  </th>
                  <th className="px-4 py-3 font-medium text-neutral-600 hidden lg:table-cell">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const total = order.orderItems.reduce(
                    (sum, oi) =>
                      sum + (oi.product?.price ?? 0) * (oi.quantity ?? 1),
                    0,
                  );
                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3">
                        <p className="font-mono text-xs font-semibold text-neutral-800">
                          #
                          {typeof order.id === "string"
                            ? order.id.slice(-8).toUpperCase()
                            : order.id}
                        </p>
                        <p className="text-xs text-muted-foreground md:hidden">
                          {order.user?.name ?? "Guest"}
                        </p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="font-medium text-neutral-700">
                          {order.user?.name ?? "Guest"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.user?.email ?? ""}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-neutral-700 line-clamp-2">
                          {order.orderItems
                            .map((oi) =>
                              oi.size
                                ? `${oi.product?.name} (${oi.size.name})`
                                : oi.product?.name,
                            )
                            .join(", ")}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {order.orderItems.length} item
                          {order.orderItems.length !== 1 ? "s" : ""}
                        </p>
                        {total > 0 && (
                          <p className="text-xs text-muted-foreground">
                            ₱{total.toLocaleString()}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            order.order_status?.toLowerCase() === "processing"
                              ? "bg-blue-50 text-blue-700"
                              : order.order_status?.toLowerCase() === "shipped"
                                ? "bg-yellow-50 text-yellow-700"
                                : order.order_status?.toLowerCase() ===
                                    "in-transit"
                                  ? "bg-yellow-50 text-yellow-700"
                                  : order.order_status?.toLowerCase() ===
                                      "delivered"
                                    ? "bg-green-50 text-green-700"
                                    : order.order_status?.toLowerCase() ===
                                        "cancelled"
                                      ? "bg-red-50 text-red-700"
                                      : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {order.order_status
                            ? order.order_status.charAt(0).toUpperCase() +
                              order.order_status.slice(1).toLowerCase()
                            : "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${order.isPaid ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}
                        >
                          {order.isPaid ? "Paid" : "Unpaid"}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("en-PH", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={fetchOrders}
        />
      )}
    </SellerLayout>
  );
};

export default SellerOrders;
