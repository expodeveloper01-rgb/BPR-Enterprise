import { useEffect, useState } from "react";
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

      fetchDelivery();

      // Refetch every 4 seconds to show real-time status updates
      const interval = setInterval(fetchDelivery, 4000);

      // Refetch when page becomes visible
      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
          fetchDelivery();
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        clearInterval(interval);
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
      };
    }
  }, [orderId, user, token, authLoading, navigate]);

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

      setDelivery(res.data.order);
      toast.success(`Status updated to ${statusTitle}`);
      setStatusModal({ open: false, newStatus: null });

      if (statusModal.newStatus === "delivered") {
        setTimeout(() => {
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

  const statusFlow = [
    {
      status: "pickup-pending",
      label: "Pickup Pending",
      action: "Ready to Pickup",
    },
    { status: "in-transit", label: "In Transit", action: "Pickup Done" },
    { status: "delivered", label: "Delivered", action: "Mark as Delivered" },
  ];

  const currentStatusIndex = statusFlow.findIndex(
    (s) => s.status === delivery.delivery_status,
  );

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

          {/* Delivery Status Flow */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-6">
              Delivery Status
            </h2>
            <div className="space-y-3">
              {statusFlow.map((step, i) => (
                <button
                  key={step.status}
                  onClick={() => {
                    if (i === currentStatusIndex) {
                      handleStatusUpdate(
                        statusFlow[i + 1]?.status || step.status,
                      );
                    }
                  }}
                  disabled={
                    i > currentStatusIndex + 1 ||
                    i < currentStatusIndex ||
                    updating ||
                    delivery.delivery_status === "delivered"
                  }
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                    i < currentStatusIndex ||
                    (i === currentStatusIndex &&
                      delivery.delivery_status === "delivered")
                      ? "border-green-500 bg-green-50"
                      : i === currentStatusIndex
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-neutral-900">
                        {step.label}
                      </p>
                      {i === currentStatusIndex &&
                        delivery.delivery_status !== "delivered" && (
                          <p className="text-xs text-blue-600 mt-1">
                            {step.action}
                          </p>
                        )}
                    </div>
                    {(i < currentStatusIndex ||
                      (i === currentStatusIndex &&
                        delivery.delivery_status === "delivered")) && (
                      <span className="text-green-600">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
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
                  {delivery.isPaid ? "Paid Online" : "Cash on Delivery"}
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
                  {delivery.isPaid ? "Paid" : "Pending"}
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
                    const nextStatus =
                      statusFlow[currentStatusIndex + 1]?.status;
                    if (nextStatus) {
                      handleStatusUpdate(nextStatus);
                    }
                  }}
                  disabled={
                    currentStatusIndex === statusFlow.length - 1 || updating
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
              {/* Status Title */}
              <div>
                <label className="text-xs font-semibold text-neutral-600 uppercase block mb-2">
                  Status Title
                </label>
                <input
                  type="text"
                  value={statusTitle}
                  onChange={(e) => setStatusTitle(e.target.value)}
                  placeholder="e.g., In Transit"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>

              {/* Status Message */}
              <div>
                <label className="text-xs font-semibold text-neutral-600 uppercase block mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={statusMessage}
                  onChange={(e) => setStatusMessage(e.target.value)}
                  placeholder="Add a message for the customer (e.g., 'Arrived at your location')"
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
                disabled={updating}
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
