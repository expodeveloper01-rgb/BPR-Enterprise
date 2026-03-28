import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useRiderAuth from "@/hooks/use-rider-auth";
import apiClient from "@/lib/api-client";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { MapPin, Package, Clock, DollarSign, Check } from "lucide-react";
import toast from "react-hot-toast";

const RiderDashboard = () => {
  const navigate = useNavigate();
  const { user, token, loading: authLoading } = useRiderAuth();
  const [profile, setProfile] = useState(null);
  const [pendingDeliveries, setPendingDeliveries] = useState([]);
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(null);
  const [acceptModal, setAcceptModal] = useState({
    open: false,
    orderId: null,
  });
  const [statusTitle, setStatusTitle] = useState("Pickup Pending");
  const [statusMessage, setStatusMessage] = useState("");
  const fetchDataRef = useRef(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/rider/login");
      return;
    }

    if (authLoading) {
      return; // Wait for auth to load before fetching
    }

    if (user && token) {
      let interval;

      const fetchData = async () => {
        try {
          const profileRes = await apiClient.get("/rider/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("📊 Dashboard - Profile fetched:", profileRes.data);
          setProfile(profileRes.data);

          const pendingRes = await apiClient.get("/rider/deliveries/pending", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const pending = pendingRes.data;
          setPendingDeliveries(pending);

          const activeRes = await apiClient.get("/rider/deliveries/active", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const active = activeRes.data;
          setActiveDeliveries(active);

          // Only keep polling if there are deliveries
          if (pending.length === 0 && active.length === 0) {
            if (interval) {
              clearInterval(interval);
              interval = null;
            }
          }
        } catch (err) {
          console.error("Failed to fetch data", err);
          if (err.response?.status === 401) {
            // Token expired or invalid
            navigate("/rider/login");
          }
        } finally {
          setLoading(false);
        }
      };

      // Store fetch function in ref so window focus listener can call it
      fetchDataRef.current = fetchData;

      // Initial fetch
      fetchData();

      // Setup polling - intentionally aggressive updates for active deliveries
      // but only when deliveries exist
      const setupPolling = () => {
        if (!interval) {
          interval = setInterval(fetchData, 20000); // 20-second polling
        }
      };

      setupPolling();

      // Refetch when page becomes visible
      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
          fetchData();
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        if (interval) clearInterval(interval);
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
      };
    }
  }, [user, token, authLoading, navigate]);

  // Refresh profile when window regains focus (e.g., returning from delivery detail)
  useEffect(() => {
    const handleWindowFocus = () => {
      console.log("🔄 Window focused - Refreshing rider data");
      if (fetchDataRef.current) {
        fetchDataRef.current();
      }
    };

    window.addEventListener("focus", handleWindowFocus);
    return () => window.removeEventListener("focus", handleWindowFocus);
  }, []);

  const handleAcceptDelivery = async (orderId) => {
    // Show modal instead of immediate accept
    setAcceptModal({ open: true, orderId });
    setStatusTitle("Pickup Pending");
    setStatusMessage("");
  };

  const handleConfirmAccept = async () => {
    setAccepting(acceptModal.orderId);
    try {
      const res = await apiClient.post(
        `/rider/deliveries/${acceptModal.orderId}/accept`,
        {
          statusTitle,
          statusMessage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success("Delivery accepted!");
      // Remove from pending and add to active
      setPendingDeliveries(
        pendingDeliveries.filter((d) => d.id !== acceptModal.orderId),
      );
      setActiveDeliveries([res.data.order, ...activeDeliveries]);
      setAcceptModal({ open: false, orderId: null });
      navigate(`/rider/deliveries/${acceptModal.orderId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept delivery");
    } finally {
      setAccepting(null);
    }
  };

  if (loading) {
    return (
      <Container className="py-12 text-center">
        <p>Loading...</p>
      </Container>
    );
  }

  return (
    <Container className="px-4 md:px-12 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
          Delivery Dashboard
        </h1>
        <p className="text-neutral-600">
          Manage and track your deliveries in real-time
        </p>
      </div>

      {/* Stats Grid */}
      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
          <div className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">
                  Total Deliveries
                </p>
                <p className="text-2xl font-bold text-neutral-900 mt-2">
                  {profile.totalDeliveries}
                </p>
              </div>
              <Package className="w-8 h-8 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">
                  Available
                </p>
                <p className="text-2xl font-bold text-neutral-900 mt-2">
                  {pendingDeliveries.length}
                </p>
              </div>
              <MapPin className="w-8 h-8 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">
                  Rating
                </p>
                <p className="text-2xl font-bold text-neutral-900 mt-2">
                  {profile.rating.toFixed(1)} ⭐
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">
                  Active
                </p>
                <p className="text-2xl font-bold text-neutral-900 mt-2">
                  {activeDeliveries.length}
                </p>
              </div>
              <Package className="w-8 h-8 text-red-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">
                  Earnings
                </p>
                <p className="text-2xl font-bold text-neutral-900 mt-2">
                  ₱{profile.earnings.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500 opacity-20" />
            </div>
          </div>
        </div>
      )}

      {/* Available Orders - Pending Deliveries */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">
          Available Orders
        </h2>

        {pendingDeliveries.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg border border-gray-100 mb-10">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-neutral-600 text-sm">
              No available orders at this time
            </p>
          </div>
        ) : (
          <div className="space-y-3 mb-10">
            {pendingDeliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-neutral-900">
                      Order #{delivery.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {delivery.userName} • {delivery.phone}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      📍 {delivery.address}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {delivery.items?.length || 0} items • ₱
                      {delivery.total
                        ? delivery.total.toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                          })
                        : "0.00"}
                    </p>
                  </div>
                  <div className="text-right flex flex-col gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-700">
                      Available
                    </span>
                    <Button
                      onClick={() => handleAcceptDelivery(delivery.id)}
                      disabled={accepting === delivery.id}
                      className="bg-black text-white hover:bg-black/80 rounded-full text-xs py-1 h-auto"
                    >
                      {accepting === delivery.id ? (
                        "Accepting..."
                      ) : (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Accept
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Deliveries */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">
          Active Deliveries
        </h2>

        {activeDeliveries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-neutral-600">No active deliveries</p>
            <p className="text-sm text-muted-foreground mt-2">
              Accept an order from &quot;Available Orders&quot; to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeDeliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/rider/deliveries/${delivery.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-neutral-900">
                      Order #{delivery.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {delivery.userName} • {delivery.phone}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      📍 {delivery.address}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {delivery.items?.length || 0} items
                    </p>
                  </div>
                  <div className="text-right">
                    {(() => {
                      // Get latest status title from history or use delivery_status
                      let statusDisplay = delivery.delivery_status;

                      if (
                        delivery.statusHistory &&
                        Array.isArray(delivery.statusHistory) &&
                        delivery.statusHistory.length > 0
                      ) {
                        const latestStatus =
                          delivery.statusHistory[
                            delivery.statusHistory.length - 1
                          ];
                        if (latestStatus.title) {
                          statusDisplay = latestStatus.title;
                        } else if (latestStatus.status) {
                          statusDisplay = latestStatus.status;
                        }
                      }

                      return (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                          {statusDisplay === "in-transit"
                            ? "In Transit"
                            : statusDisplay === "pickup-pending"
                              ? "Pickup Pending"
                              : statusDisplay === "delivered"
                                ? "Delivered"
                                : statusDisplay
                                    ?.split("-")
                                    .map(
                                      (word) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1),
                                    )
                                    .join(" ") || "Pending"}
                        </span>
                      );
                    })()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Accept Delivery Modal */}
      {acceptModal.open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">
              Accept Delivery
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
                  placeholder="e.g., Pickup Pending"
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
                  placeholder="Add a message for the customer (e.g., 'Order is being prepared')"
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
                onClick={() => setAcceptModal({ open: false, orderId: null })}
                variant="outline"
                className="flex-1"
                disabled={accepting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmAccept}
                disabled={accepting}
                className="flex-1 bg-black text-white hover:bg-black/80"
              >
                {accepting ? "Accepting..." : "Confirm Accept"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default RiderDashboard;
