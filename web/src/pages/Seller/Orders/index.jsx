import { useEffect, useState } from "react";
import SellerLayout from "../SellerLayout";
import apiClient from "@/lib/api-client";
import toast from "react-hot-toast";
import { ShoppingBag } from "lucide-react";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/admin/orders")
      .then((r) => setOrders(r.data))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SellerLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Orders</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {orders.length} total orders
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
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
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-4 py-3 font-medium text-neutral-600">
                    Order ID
                  </th>
                  <th className="px-4 py-3 font-medium text-neutral-600 hidden md:table-cell">
                    Customer
                  </th>
                  <th className="px-4 py-3 font-medium text-neutral-600 hidden md:table-cell">
                    Items
                  </th>
                  <th className="px-4 py-3 font-medium text-neutral-600">
                    Status
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
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="font-mono text-xs font-semibold text-neutral-800">
                          #{order.id.slice(-8).toUpperCase()}
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
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-neutral-700">
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
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${order.isPaid ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}
                        >
                          {order.isPaid ? "Paid" : "Pending"}
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
    </SellerLayout>
  );
};

export default SellerOrders;
