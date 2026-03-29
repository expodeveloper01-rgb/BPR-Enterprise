import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { orderService } from "../services/cart-order.service";
import { useAuthStore } from "../stores/authStore";

export default function OrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await orderService.getOrders();
      setOrders(data);
      setError(null);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to load orders";
      setError(errorMessage);
      console.error("Error loading orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const handleDeleteOrder = (orderId) => {
    Alert.alert(
      "Delete Order",
      "Are you sure you want to delete this order from your history?",
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            // Remove order from list
            setOrders(orders.filter((order) => order.id !== orderId));
          },
          style: "destructive",
        },
      ],
    );
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: "Pending",
        bg: "#F3F4F6",
        text: "#374151",
        border: "#E5E7EB",
      },
      confirmed: {
        label: "Confirmed",
        bg: "#DBEAFE",
        text: "#1E40AF",
        border: "#93C5FD",
      },
      preparing: {
        label: "Preparing",
        bg: "#FEF3C7",
        text: "#92400E",
        border: "#FCD34D",
      },
      ready: {
        label: "Ready",
        bg: "#DCFCE7",
        text: "#166534",
        border: "#86EFAC",
      },
      out_for_delivery: {
        label: "In Transit",
        bg: "#FEE2E2",
        text: "#991B1B",
        border: "#FECACA",
      },
      delivered: {
        label: "Delivered",
        bg: "#D1FAE5",
        text: "#065F46",
        border: "#6EE7B7",
      },
      cancelled: {
        label: "Cancelled",
        bg: "#FEE2E2",
        text: "#7F1D1D",
        border: "#FCA5A5",
      },
    };
    return (
      configs[status] || {
        label: status,
        bg: "#F3F4F6",
        text: "#374151",
        border: "#E5E7EB",
      }
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-PH", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const renderOrderCard = ({ item }) => {
    const statusConfig = getStatusConfig(item.status);
    const itemCount = item.items?.length || 0;

    return (
      <View style={styles.orderCardWrapper}>
        <TouchableOpacity
          style={styles.orderCard}
          onPress={() =>
            navigation.navigate("OrderDetail", { orderId: item.id })
          }
          activeOpacity={0.7}
        >
          {/* Header: Product Images and Order ID */}
          <View style={styles.cardHeader}>
            <View style={styles.imageContainer}>
              {item.items?.slice(0, 2).map((product, index) => (
                <View
                  key={product.id}
                  style={[
                    styles.productImage,
                    index > 0 && { marginLeft: -12 },
                    { zIndex: 2 - index },
                  ]}
                >
                  {product.product?.image ? (
                    <Image
                      source={{ uri: product.product.image }}
                      style={styles.image}
                    />
                  ) : (
                    <View style={styles.imagePlaceholder} />
                  )}
                </View>
              ))}
              {itemCount > 2 && (
                <View style={styles.moreItems}>
                  <Text style={styles.moreItemsText}>+{itemCount - 2}</Text>
                </View>
              )}
            </View>

            <View style={styles.orderIdBadge}>
              <Text style={styles.orderIdText}>
                #
                {typeof item.id === "string"
                  ? item.id.slice(-8).toUpperCase()
                  : item.id}
              </Text>
            </View>
          </View>

          {/* Product Names */}
          <View style={styles.productInfoSection}>
            <Text style={styles.productNames} numberOfLines={2}>
              {item.items
                ?.map((p) =>
                  p.size
                    ? `${p.product?.name} (${p.size.name})`
                    : p.product?.name,
                )
                .join(", ")}
            </Text>
            <Text style={styles.itemCount}>
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </Text>
          </View>

          {/* Total Price */}
          <View style={styles.priceSection}>
            <Text style={styles.totalPrice}>
              ₱
              {Number(item.totalAmount || 0).toLocaleString("en-PH", {
                minimumFractionDigits: 2,
              })}
            </Text>
          </View>

          {/* Status and Date Row */}
          <View style={styles.statusDateRow}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: statusConfig.bg,
                  borderColor: statusConfig.border,
                },
              ]}
            >
              <Text style={[styles.statusText, { color: statusConfig.text }]}>
                {statusConfig.label}
              </Text>
            </View>
            <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
          </View>

          {/* Latest Status Update Info */}
          {item.statusHistory && item.statusHistory.length > 0 && (
            <View style={styles.latestUpdateBox}>
              <Text style={styles.latestUpdateLabel}>Latest Update</Text>
              <Text style={styles.latestUpdateMessage}>
                {item.statusHistory[item.statusHistory.length - 1]?.title ||
                  item.statusHistory[item.statusHistory.length - 1]?.message ||
                  "Order status updated"}
              </Text>
              <Text style={styles.latestUpdateTime}>
                {formatTime(
                  item.statusHistory[item.statusHistory.length - 1]
                    ?.timestamp || item.createdAt,
                )}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Delete Button - Bottom Right (Outside TouchableOpacity) */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteOrder(item.id)}
        >
          <MaterialIcons name="delete-outline" size={18} color="#DC2626" />
        </TouchableOpacity>
      </View>
    );
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyHeading}>Sign in Required</Text>
          <Text style={styles.emptyText}>
            Please sign in to view your order history
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Auth")}
          >
            <Text style={styles.primaryButtonText}>Go to Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1F2937" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Failed to load orders</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadOrders}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyHeading}>No Orders Yet</Text>
          <Text style={styles.emptyText}>
            Start shopping to place your first order
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.primaryButtonText}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListHeaderComponent={<Text style={styles.headerText}>My Orders</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
    letterSpacing: -0.5,
    paddingTop: 20,
    marginTop: 8,
  },

  // Order Card Wrapper
  orderCardWrapper: {
    position: "relative",
    marginBottom: 12,
  },

  // Order Card Styles
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  // Delete Button - Bottom Right
  deleteButton: {
    position: "absolute",
    bottom: -6,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  // Card Header: Images and Order ID
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F3F4F6",
  },
  moreItems: {
    width: 40,
    height: 56,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -8,
  },
  moreItemsText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  orderIdBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  orderIdText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
  },

  // Product Info Section
  productInfoSection: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingBottom: 12,
  },
  productNames: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 13,
    color: "#6B7280",
  },

  // Price Section
  priceSection: {
    marginBottom: 12,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  // Status and Date Row
  statusDateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  dateText: {
    fontSize: 12,
    color: "#6B7280",
  },

  // Latest Update Box
  latestUpdateBox: {
    backgroundColor: "#DBEAFE",
    borderWidth: 1,
    borderColor: "#93C5FD",
    borderRadius: 10,
    padding: 12,
  },
  latestUpdateLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1E40AF",
    marginBottom: 2,
  },
  latestUpdateMessage: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E40AF",
    marginBottom: 4,
  },
  latestUpdateTime: {
    fontSize: 11,
    color: "#2563EB",
  },

  // Empty States
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyHeading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 24,
    textAlign: "center",
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },

  // Error State
  errorContainer: {
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 10,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#991B1B",
    marginBottom: 4,
  },
  errorText: {
    fontSize: 13,
    color: "#7F1D1D",
    marginBottom: 10,
  },

  // Buttons
  primaryButton: {
    backgroundColor: "#111827",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  retryButtonText: {
    color: "#DC2626",
    fontWeight: "600",
    fontSize: 13,
  },
});
