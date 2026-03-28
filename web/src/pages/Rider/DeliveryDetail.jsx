import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useRiderAuth from "@/hooks/use-rider-auth";
import apiClient from "@/lib/api-client";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Navigation } from "lucide-react";
import toast from "react-hot-toast";

const DeliveryDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user, token, loading: authLoading } = useRiderAuth();
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusModal, setStatusModal] = useState({
    open: false,
    newStatus: null,
  });
  const [statusTitle, setStatusTitle] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const fetchDeliveryRef = useRef(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/rider/login");
      return;
    }

    if (authLoading) {
      return; // Wait for auth to load
    }

    if (user && token) {
      const fetchDelivery = async () => {
        try {
          const res = await apiClient.get(`/rider/deliveries/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          console.log("📦 Delivery fetched:", {
            order_status: res.data.order_status,
            delivery_status: res.data.delivery_status,
            isPaid: res.data.isPaid,
          });

          setDelivery(res.data);
        } catch (err) {
          console.error("Failed to load delivery:", err);
          if (err.response?.status === 401) {
            navigate("/rider/login");
          } else {
            toast.error(
              err.response?.data?.message || "Failed to load delivery",
            );
            navigate("/rider");
          }
        } finally {
          setLoading(false);
        }
      };

      // Store in ref so polling effect can call it
      fetchDeliveryRef.current = fetchDelivery;

      // Initial fetch
      fetchDelivery();

      // Refetch when page becomes visible
      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
          fetchDelivery();
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
      };
    }
  }, [orderId, user, token, authLoading, navigate]);

  // Separate polling effect that respects modal state
  useEffect(() => {
    if (!delivery || statusModal.open) {
      return; // Don't poll while modal is open
    }

    const interval = setInterval(() => {
      if (fetchDeliveryRef.current) {
        fetchDeliveryRef.current();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [delivery, statusModal.open]);

  const handleStatusUpdate = async (newStatus) => {
    // Get label for the new status
    const statusFlow = [
      { status: "pickup-pending", label: "Pickup Pending" },
      { status: "in-transit", label: "In Transit" },
      { status: "delivered", label: "Delivered" },
    ];
    const statusLabel =
      statusFlow.find((s) => s.status === newStatus)?.label || newStatus;

    setStatusTitle(statusLabel);
    setStatusMessage("");
    setStatusModal({ open: true, newStatus });
  };

  // Get the next status in the delivery flow
  const getNextStatus = () => {
    const statusFlow = ["pickup-pending", "in-transit", "delivered"];
    const currentIndex = statusFlow.indexOf(delivery.delivery_status);
    if (currentIndex === -1 || currentIndex >= statusFlow.length - 1) {
      return null; // No next status
    }
    return statusFlow[currentIndex + 1];
  };

  const handleConfirmStatusUpdate = async () => {
    setUpdating(true);
    try {
      const res = await apiClient.patch(
        `/rider/deliveries/${orderId}/status`,
        {
          status: statusModal.newStatus,
          statusTitle,
          statusMessage,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Handle both response formats:
      // If wrapped with { message, order }: use res.data.order
      // If returned directly: use res.data
      const updatedOrder = res.data.order || res.data;

      console.log("🔍 Updated order received:", {
        order_status: updatedOrder.order_status,
        delivery_status: updatedOrder.delivery_status,
        isPaid: updatedOrder.isPaid,
      });

      setDelivery(updatedOrder);
      toast.success(`Status updated to ${statusTitle}`);
      setStatusModal({ open: false, newStatus: null });

      // Wait a moment then force a refresh to ensure UI is in sync
      setTimeout(async () => {
        try {
          const refreshRes = await apiClient.get(
            `/rider/deliveries/${orderId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          console.log("🔄 Refresh after update:", {
            order_status: refreshRes.data.order_status,
            delivery_status: refreshRes.data.delivery_status,
            isPaid: refreshRes.data.isPaid,
          });
          setDelivery(refreshRes.data);
        } catch (err) {
          console.error("Failed to refresh delivery:", err);
        }
      }, 500);

      if (statusModal.newStatus === "delivered") {
        // Wait for backend to finish stats update, then check profile before navigating
        setTimeout(async () => {
          try {
            console.log("📊 Checking rider profile before navigation...");
            const profileRes = await apiClient.get("/rider/profile", {
              headers: { Authorization: `Bearer ${token}` },
            });
            console.log("✅ Fresh profile from backend:", {
              totalDeliveries: profileRes.data.totalDeliveries,
              earnings: profileRes.data.earnings,
            });
          } catch (err) {
            console.error("Failed to fetch profile before navigation:", err);
          }

          console.log("✅ Order delivered, navigating back to dashboard");
          navigate("/rider");
        }, 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-12 text-center">
        <p>Loading delivery details...</p>
      </Container>
    );
  }

  if (!delivery) {
    return (
      <Container className="py-12 text-center">
        <p>Delivery not found</p>
      </Container>
    );
  }

  // Main component render
  return (
    <Container className="px-4 md:px-12 py-10">
      {/* Header */}
      <div className="mb-8">
        <Button
          onClick={() => navigate("/rider")}
          variant="ghost"
          className="mb-4"
        >
          ← Back to Dashboard
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">
          Order #{delivery.id.slice(-8).toUpperCase()}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-4">
              Customer Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-neutral-600 uppercase">
                  Name
                </p>
                <p className="text-neutral-900 mt-1">{delivery.userName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-600 uppercase">
                  Phone
                </p>
                <a
                  href={`tel:${delivery.phone}`}
                  className="text-blue-600 hover:underline mt-1 flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  {delivery.phone}
                </a>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-600 uppercase">
                  Address
                </p>
                <div className="flex items-start gap-2 mt-1">
                  <MapPin className="w-4 h-4 mt-1 text-red-500 flex-shrink-0" />
                  <p className="text-neutral-900">{delivery.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-4">
              Order Items
            </h2>
            {delivery.items && delivery.items.length > 0 ? (
              <div className="space-y-3">
                {delivery.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-neutral-900">
                        {item.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-neutral-900">
                      ₱{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-600">No items</p>
            )}
          </div>

          {/* Current Delivery Status */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-4">
              Delivery Status
            </h2>
            {delivery.statusHistory && delivery.statusHistory.length > 0 ? (
              <div className="space-y-4">
                {/* Current status */}
                <div className="p-4 rounded-lg border-l-4 border-blue-500 bg-blue-50">
                  <p className="text-xs font-semibold text-blue-600 uppercase">
                    Current Status
                  </p>
                  <p className="text-lg font-bold text-neutral-900 mt-2">
                    {delivery.statusHistory[delivery.statusHistory.length - 1]
                      ?.title ||
                      delivery.statusHistory[delivery.statusHistory.length - 1]
                        ?.status}
                  </p>
                  {delivery.statusHistory[delivery.statusHistory.length - 1]
                    ?.message && (
                    <p className="text-sm text-neutral-700 mt-2">
                      {
                        delivery.statusHistory[
                          delivery.statusHistory.length - 1
                        ].message
                      }
                    </p>
                  )}
                  {delivery.statusHistory[delivery.statusHistory.length - 1]
                    ?.timestamp && (
                    <p className="text-xs text-blue-600 mt-2">
                      {new Date(
                        delivery.statusHistory[
                          delivery.statusHistory.length - 1
                        ].timestamp,
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

                {/* Status history timeline */}
                {delivery.statusHistory.length > 1 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs font-semibold text-neutral-600 uppercase mb-3">
                      History
                    </p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {delivery.statusHistory
                        .slice()
                        .reverse()
                        .map((entry, idx) => (
                          <div
                            key={idx}
                            className="flex gap-3 text-sm pb-2 border-b border-gray-100 last:border-0"
                          >
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-neutral-600">
                              {delivery.statusHistory.length - idx}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-neutral-900">
                                {entry.title || entry.status}
                              </p>
                              {entry.message && (
                                <p className="text-xs text-neutral-600 mt-0.5 line-clamp-2">
                                  {entry.message}
                                </p>
                              )}
                              <p className="text-xs text-neutral-500 mt-0.5">
                                {new Date(entry.timestamp).toLocaleString(
                                  "en-PH",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    timeZone: "Asia/Manila",
                                    hour12: true,
                                  },
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-neutral-600">No status updates yet</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Status */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-4">Payment</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-neutral-600 uppercase">
                  Method
                </p>
                <p className="text-neutral-900 mt-1">
                  {delivery.paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : "Paid Online"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-600 uppercase">
                  Status
                </p>
                <span
                  className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mt-1 ${
                    delivery.isPaid
                      ? "bg-green-50 text-green-700"
                      : "bg-yellow-50 text-yellow-700"
                  }`}
                >
                  {delivery.isPaid ? "Received" : "Pending"}
                </span>
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-4">
              Order Status
            </h2>
            <p className="text-neutral-900 capitalize">
              {delivery.order_status}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            {delivery.delivery_status !== "delivered" && (
              <>
                <Button
                  onClick={() =>
                    window.open(
                      `https://maps.google.com/?q=${encodeURIComponent(delivery.address)}`,
                    )
                  }
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-lg flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  Open in Maps
                </Button>
                <Button
                  onClick={() => {
                    const nextStatus = getNextStatus();
                    if (nextStatus) {
                      handleStatusUpdate(nextStatus);
                    }
                  }}
                  disabled={
                    delivery.delivery_status === "delivered" ||
                    !getNextStatus() ||
                    updating
                  }
                  className="w-full bg-green-600 text-white hover:bg-green-700 rounded-lg"
                >
                  {updating ? "Updating..." : "Update Status"}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {statusModal.open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">
              Update Delivery Status
            </h2>

            <div className="space-y-4">
              {/* Current Status */}
              <div>
                <label className="text-xs font-semibold text-neutral-600 uppercase block mb-2">
                  Current Status
                </label>
                <div className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50">
                  {delivery?.delivery_status
                    ?.split("-")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ")}
                </div>
              </div>

              {/* Status Selector - ONLY show statuses ahead in the flow */}
              <div>
                <label className="text-xs font-semibold text-neutral-600 uppercase block mb-2">
                  Update To Status
                </label>
                <div className="space-y-2">
                  {["pickup-pending", "in-transit", "delivered"].map((s) => {
                    const flowIndex = [
                      "pickup-pending",
                      "in-transit",
                      "delivered",
                    ].indexOf(s);
                    const currentIndex = [
                      "pickup-pending",
                      "in-transit",
                      "delivered",
                    ].indexOf(delivery?.delivery_status);
                    // Only allow statuses that are the same or ahead in the flow
                    const isAllowed = flowIndex >= currentIndex;
                    const isSelected = statusModal.newStatus === s;

                    return (
                      <button
                        key={s}
                        onClick={() => {
                          if (isAllowed) {
                            // Update statusModal to new status AND update statusTitle
                            const labels = {
                              "pickup-pending": "Pickup Pending",
                              "in-transit": "In Transit",
                              delivered: "Delivered",
                            };
                            setStatusModal({ ...statusModal, newStatus: s });
                            setStatusTitle(labels[s]);
                          }
                        }}
                        disabled={!isAllowed}
                        className={`w-full px-3 py-2 border rounded-lg text-sm transition-colors ${
                          isSelected
                            ? "bg-black text-white border-black"
                            : isAllowed
                              ? "bg-white text-neutral-900 border-gray-200 hover:border-black/50"
                              : "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed"
                        }`}
                      >
                        {s
                          .split("-")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" ")}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status Message */}
              <div>
                <label className="text-xs font-semibold text-neutral-600 uppercase block mb-2">
                  Update Message (Optional)
                </label>
                <textarea
                  value={statusMessage}
                  onChange={(e) => setStatusMessage(e.target.value)}
                  placeholder="Add a message for the customer (e.g., 'Arrived at your location', 'Waiting for food preparation')"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/20 resize-none"
                  rows="3"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {statusMessage.length}/200
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setStatusModal({ open: false, newStatus: null })}
                variant="outline"
                className="flex-1"
                disabled={updating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmStatusUpdate}
                disabled={updating || !statusModal.newStatus}
                className="flex-1 bg-black text-white hover:bg-black/80"
              >
                {updating ? "Updating..." : "Confirm Update"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default DeliveryDetail;
