import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useRiderAuth from "@/hooks/use-rider-auth";
import apiClient from "@/lib/api-client";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Package } from "lucide-react";
import toast from "react-hot-toast";

const RiderDeliveries = ({ mode = "pending" }) => {
  const navigate = useNavigate();
  const { user, token, loading: authLoading } = useRiderAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(null);

  const modeConfig = {
    pending: {
      endpoint: "/rider/deliveries/pending",
      title: "Available Deliveries",
      subtitle: "Found {count} delivery{s}",
      emptyTitle: "No Available Deliveries",
      emptyMessage: "Check back later for new delivery orders",
      allowAccept: true,
    },
    active: {
      endpoint: "/rider/deliveries/active",
      title: "Active Deliveries",
      subtitle: "You have {count} active delivery{s}",
      emptyTitle: "No Active Deliveries",
      emptyMessage: "Accept a delivery from Available Orders to start",
      allowAccept: false,
    },
    history: {
      endpoint: "/rider/deliveries/history",
      title: "Delivery History",
      subtitle: "{count} completed delivery{s}",
      emptyTitle: "No Completed Deliveries",
      emptyMessage: "Your completed deliveries will appear here",
      allowAccept: false,
    },
  };

  const config = modeConfig[mode] || modeConfig.pending;

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/rider/login");
      return;
    }

    if (authLoading) {
      return;
    }

    if (user && token) {
      const fetchDeliveries = async () => {
        try {
          const res = await apiClient.get(config.endpoint, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setDeliveries(res.data);
        } catch (err) {
          console.error("Failed to load deliveries:", err);
          if (err.response?.status === 401) {
            navigate("/rider/login");
          } else {
            toast.error("Failed to load deliveries");
          }
        } finally {
          setLoading(false);
        }
      };

      fetchDeliveries();
    }
  }, [user, token, authLoading, navigate, mode, config.endpoint]);

  const handleAcceptDelivery = async (orderId) => {
    setAccepting(orderId);
    try {
      await apiClient.post(
        `/rider/deliveries/${orderId}/accept`,
        {
          statusTitle: "Pickup Pending",
          statusMessage: "",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success("Delivery accepted!");
      setDeliveries(deliveries.filter((d) => d.id !== orderId));
      navigate(`/rider/deliveries/${orderId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept delivery");
    } finally {
      setAccepting(null);
    }
  };

  if (loading) {
    return (
      <Container className="py-12 text-center">
        <p>Loading deliveries...</p>
      </Container>
    );
  }

  const count = deliveries.length;
  const subtitle = config.subtitle
    .replace("{count}", count)
    .replace("{s}", count !== 1 ? "s" : "");

  return (
    <Container className="px-4 md:px-12 py-10">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
          {config.title}
        </h1>
        <p className="text-neutral-600">{subtitle}</p>
      </div>

      {deliveries.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-gray-100">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">
            {config.emptyTitle}
          </h2>
          <p className="text-neutral-600 mb-6">{config.emptyMessage}</p>
          <Button
            onClick={() => navigate("/rider")}
            className="bg-black text-white hover:bg-black/80 rounded-full"
          >
            Go to Dashboard
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {deliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="bg-white rounded-lg border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-lg font-bold text-neutral-900">
                    Order #{delivery.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {delivery.userName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-600">
                    {delivery.items?.length || 0} items
                  </p>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-neutral-700">
                  <Phone className="w-4 h-4" />
                  <p className="text-sm">{delivery.phone}</p>
                </div>
                <div className="flex items-start gap-2 text-neutral-700">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <p className="text-sm">{delivery.address}</p>
                </div>
              </div>

              {/* Items */}
              {delivery.items && delivery.items.length > 0 && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-semibold text-neutral-600 mb-2">
                    ITEMS
                  </p>
                  <div className="space-y-1">
                    {delivery.items.map((item, i) => (
                      <p key={i} className="text-sm text-neutral-700">
                        {item.name} × {item.quantity} - ₱
                        {(item.price * item.quantity).toLocaleString()}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment & Status */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    delivery.isPaid
                      ? "bg-green-50 text-green-700"
                      : "bg-yellow-50 text-yellow-700"
                  }`}
                >
                  {delivery.isPaid ? "Paid" : "COD"}
                </span>
                {delivery.delivery_status && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                    {delivery.delivery_status.charAt(0).toUpperCase() +
                      delivery.delivery_status.slice(1)}
                  </span>
                )}
              </div>

              {/* Action Button */}
              {config.allowAccept ? (
                <Button
                  onClick={() => handleAcceptDelivery(delivery.id)}
                  disabled={accepting === delivery.id}
                  className="w-full bg-black text-white hover:bg-black/80 rounded-lg"
                >
                  {accepting === delivery.id
                    ? "Accepting..."
                    : "Accept Delivery"}
                </Button>
              ) : (
                <Button
                  onClick={() => navigate(`/rider/deliveries/${delivery.id}`)}
                  variant="outline"
                  className="w-full rounded-lg"
                >
                  View Details
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};

export default RiderDeliveries;
