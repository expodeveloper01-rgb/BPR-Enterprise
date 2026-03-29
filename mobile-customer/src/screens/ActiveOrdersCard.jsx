import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { orderService } from "../services/cart-order.service";
import { useAuthStore } from "../stores/authStore";

const getLatestStatusTitle = (order) => {
  if (order.order_status === "pending_confirmation") {
    return "Waiting for Confirmation";
  }

  const statusTitles = {
    pending: "Order Pending",
    processing: "Processing Your Order",
    shipped: "On the Way",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return statusTitles[order.delivery_status] || "Order Pending";
};

const statusColors = {
  pending_confirmation: {
    bg: "#FFF7ED",
    border: "#FDBA74",
    text: "#92400E",
  },
  pending: {
    bg: "#FEFCE8",
    border: "#FACC15",
    text: "#713F12",
  },
  processing: {
    bg: "#EFF6FF",
    border: "#60A5FA",
    text: "#1E40AF",
  },
  shipped: {
    bg: "#F3E8FF",
    border: "#D8B4FE",
    text: "#6B21A8",
  },
  delivered: {
    bg: "#DCFCE7",
    border: "#86EFAC",
    text: "#166534",
  },
};

const ActiveOrdersCard = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const data = await orderService.getOrders();
      setOrders(data);

      // Filter for non-delivered and non-cancelled orders
      const active = data.filter(
        (order) =>
          order.delivery_status !== "delivered" &&
          order.delivery_status !== "cancelled",
      );
      setActiveOrders(active);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, [user]);

  // Polling: refresh every 15 seconds
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, [user]);

  if (!loading && activeOrders.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
    );
  }

  return (
    <View style={styles.ordersContainer}>
      {activeOrders.map((order) => {
        const total =
          order.orderItems?.reduce(
            (sum, item) =>
              sum + (item.product?.price ?? 0) * (item.quantity ?? 1),
            0,
          ) || 0;

        const statusKey =
          order.order_status === "pending_confirmation"
            ? "pending_confirmation"
            : order.delivery_status || "pending";

        const colors = statusColors[statusKey] || statusColors.pending;

        return (
          <View
            key={order.id}
            style={[
              styles.orderCard,
              {
                backgroundColor: colors.bg,
                borderColor: colors.border,
              },
            ]}
          >
            {/* Header */}
            <View style={styles.orderHeader}>
              <View style={styles.orderTitleContainer}>
                <Text
                  style={[styles.orderTitle, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {getLatestStatusTitle(order)}
                </Text>
                <Text
                  style={[styles.orderId, { color: colors.text }]}
                  numberOfLines={1}
                >
                  Order #{order.id?.slice(-8).toUpperCase() || "N/A"}
                </Text>
              </View>
              <Text
                style={[styles.orderTotal, { color: colors.text }]}
                numberOfLines={1}
              >
                ₱{total.toFixed(2)}
              </Text>
            </View>

            {/* Items Summary */}
            {order.orderItems && order.orderItems.length > 0 && (
              <View style={styles.itemsSeparator}>
                <Text
                  style={[styles.itemsLabel, { color: colors.text }]}
                  opacity={0.7}
                >
                  Items:
                </Text>
                <View style={styles.itemsList}>
                  {order.orderItems.slice(0, 3).map((item, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.itemBadge,
                        { backgroundColor: colors.border + "40" },
                      ]}
                    >
                      <Text
                        style={[styles.itemBadgeText, { color: colors.text }]}
                        numberOfLines={1}
                      >
                        {item.product?.name || "Item"} ×{item.quantity || 1}
                      </Text>
                    </View>
                  ))}
                  {order.orderItems.length > 3 && (
                    <View
                      style={[
                        styles.itemBadge,
                        { backgroundColor: colors.border + "40" },
                      ]}
                    >
                      <Text
                        style={[styles.itemBadgeText, { color: colors.text }]}
                      >
                        +{order.orderItems.length - 3} more
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Address */}
            {order.address && (
              <View style={styles.addressContainer}>
                <Text
                  style={[styles.addressText, { color: colors.text }]}
                  numberOfLines={2}
                  opacity={0.8}
                >
                  📍 {order.address}
                </Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  ordersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  orderCard: {
    borderRadius: 12,
    borderWidth: 2,
    padding: 14,
    marginBottom: 6,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  orderTitleContainer: {
    flex: 1,
    marginRight: 10,
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  orderId: {
    fontSize: 11,
    fontWeight: "500",
    opacity: 0.75,
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: "700",
  },
  itemsSeparator: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  itemsLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 6,
  },
  itemsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  itemBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  itemBadgeText: {
    fontSize: 10,
    fontWeight: "500",
  },
  addressContainer: {
    marginTop: 10,
    paddingTop: 8,
  },
  addressText: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "500",
  },
});

export default ActiveOrdersCard;
