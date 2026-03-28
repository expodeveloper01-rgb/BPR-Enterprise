import { useEffect, useState, useRef } from "react";
import SellerLayout from "../SellerLayout";
import { useSeller } from "@/context/SellerContext";
import apiClient from "@/lib/api-client";
import toast from "react-hot-toast";
import { ShoppingBag, Check, X } from "lucide-react";
import { getLatestStatusTitle } from "@/lib/status-utils";
import OrderDetail from "./OrderDetail";

const SellerOrders = () => {
  const { selectedKitchenId } = useSeller();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // "pending" or "all"
  const [confirmingOrderId, setConfirmingOrderId] = useState(null);
  const [rejectingOrderId, setRejectingOrderId] = useState(null);
  const [confirmationNote, setConfirmationNote] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const isInitialLoadRef = useRef(true);

  const fetchOrders = (isInitialLoad = false) => {
    if (!selectedKitchenId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    // Only show loading on initial load or when tab changes
    if (isInitialLoad) {
      setLoading(true);
    }

    const endpoint =
      activeTab === "pending"
        ? `/admin/orders/pending-confirmation?kitchenId=${selectedKitchenId}`
        : `/admin/orders?kitchen=${selectedKitchenId}`;

    apiClient
      .get(endpoint)
      .then((r) => {
        // Normalize data format: pending endpoint returns 'items', others return 'orderItems'
        const normalizedOrders = r.data.map((order) => ({
          ...order,
          orderItems: order.items || order.orderItems || [],
        }));

        // Only update state if data has actually changed to prevent blinking
        setOrders((prevOrders) => {
          const prevJson = JSON.stringify(prevOrders);
          const newJson = JSON.stringify(normalizedOrders);
          return prevJson === newJson ? prevOrders : normalizedOrders;
        });

        if (isInitialLoad) {
          setLoading(false);
        }
      })
      .catch(() => {
        toast.error("Failed to load orders");
        setOrders([]);
        if (isInitialLoad) {
          setLoading(false);
        }
      });
  };

  const handleConfirmOrder = (orderId) => {
    setConfirmingOrderId(orderId);
    setConfirmationMessage("");
    setConfirmationNote("");
  };

  const handleSubmitConfirmation = async () => {
    try {
      await apiClient.patch(`/admin/orders/${confirmingOrderId}/confirm`, {
        confirmationNote: confirmationNote.trim(),
        confirmationMessage: confirmationMessage.trim(),
      });
      toast.success("Order confirmed!");
      setConfirmationNote("");
      setConfirmationMessage("");
      setConfirmingOrderId(null);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to confirm order");
    }
  };

  const handleRejectOrder = async (orderId) => {
    try {
      setRejectingOrderId(orderId);
      await apiClient.patch(`/admin/orders/${orderId}/reject`, {
        reason: rejectionReason.trim(),
      });
      toast.success("Order rejected");
      setRejectionReason("");
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject order");
    } finally {
      setRejectingOrderId(null);
    }
  };

  // Separate effect for tab changes - fetch immediately with loading state
  useEffect(() => {
    if (selectedKitchenId) {
      fetchOrders(true); // isInitialLoad = true, shows loading spinner
    }
  }, [activeTab, selectedKitchenId]);

  // Polling effect - only restarts when kitchen changes, not when tab changes
  useEffect(() => {
    if (!selectedKitchenId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    // Refetch every 20 seconds for seller orders
    // (changes only occur when seller takes action, not real-time updates)
    const interval = setInterval(fetchOrders, 20000);

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
            {orders.length}{" "}
            {activeTab === "pending" ? "pending confirmation" : "total"} orders
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "all"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            All Orders
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "pending"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Pending Confirmation
          </button>
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
                  {activeTab === "pending" && (
                    <th className="px-4 py-3 font-medium text-neutral-600">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  // Use order.total if provided by API, otherwise calculate
                  const total =
                    order.total ||
                    order.orderItems.reduce(
                      (sum, oi) =>
                        sum +
                        (oi.price || oi.product?.price || 0) *
                          (oi.quantity ?? 1),
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
                          {order.userName ?? order.user?.name ?? "Guest"}
                        </p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="font-medium text-neutral-700">
                          {order.userName ?? order.user?.name ?? "Guest"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.userEmail ?? order.user?.email ?? ""}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-neutral-700 line-clamp-2">
                          {order.orderItems
                            .map((oi) => {
                              const itemName = oi.name || oi.product?.name;
                              return oi.size
                                ? `${itemName} (${oi.size.name})`
                                : itemName;
                            })
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
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                          {getLatestStatusTitle(order)}
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
                        {new Date(order.createdAt).toLocaleString("en-PH", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: "Asia/Manila",
                          hour12: true,
                        })}
                      </td>
                      {activeTab === "pending" && (
                        <td
                          className="px-4 py-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleConfirmOrder(order.id)}
                              disabled={
                                confirmingOrderId === order.id ||
                                rejectingOrderId === order.id
                              }
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded disabled:opacity-50"
                              title="Confirm order"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setRejectingOrderId(order.id)}
                              disabled={
                                confirmingOrderId === order.id ||
                                rejectingOrderId === order.id
                              }
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                              title="Reject order"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Confirmation Modal */}
        {confirmingOrderId && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-sm w-full p-6">
              <h3 className="text-lg font-bold text-neutral-800 mb-4">
                Confirm Order
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Confirmation Message
                  </label>
                  <textarea
                    value={confirmationMessage}
                    onChange={(e) => setConfirmationMessage(e.target.value)}
                    placeholder="e.g., Order confirmed and ready for pickup! Expected pickup time: 30 minutes"
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Internal Note (optional)
                  </label>
                  <textarea
                    value={confirmationNote}
                    onChange={(e) => setConfirmationNote(e.target.value)}
                    placeholder="Internal notes about this order"
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-16"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setConfirmingOrderId(null);
                    setConfirmationMessage("");
                    setConfirmationNote("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitConfirmation}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rejection Modal */}
        {rejectingOrderId && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-sm w-full p-6">
              <h3 className="text-lg font-bold text-neutral-800 mb-4">
                Reject Order
              </h3>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Reason for rejection (optional)"
                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24"
              />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setRejectingOrderId(null)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRejectOrder(rejectingOrderId)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
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
