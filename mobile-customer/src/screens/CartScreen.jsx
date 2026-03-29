import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
  Platform,
  AppState,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useCartStore } from "../stores/cartStore";

export default function CartScreen({ navigation }) {
  const {
    items,
    total,
    isLoading,
    error,
    removeItem,
    updateItem,
    initializeCart,
  } = useCartStore();
  const appStateRef = useRef(AppState.currentState);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    initializeCart();
  }, []);

  // Sync cart whenever screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      initializeCart();
    }, []),
  );

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await initializeCart();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Sync cart when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState) => {
    if (
      appStateRef.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      // App has come to foreground - refresh cart to sync with other devices
      initializeCart();
    }
    appStateRef.current = nextAppState;
  };

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }

    try {
      await updateItem(cartItemId, newQuantity);
    } catch (error) {
      Alert.alert("Error", "Failed to update cart item");
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    Alert.alert("Remove Item", "Are you sure you want to remove this item?", [
      { text: "Cancel", onPress: () => {}, style: "cancel" },
      {
        text: "Remove",
        onPress: async () => {
          try {
            await removeItem(cartItemId);
          } catch (error) {
            Alert.alert("Error", "Failed to remove item");
          }
        },
        style: "destructive",
      },
    ]);
  };

  const calculateItemTotal = (item) => {
    return (item.price || 0) * (item.quantity || 1);
  };

  const calculateCartTotal = () => {
    return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  const renderCartItem = ({ item }) => (
    <Pressable
      style={[
        styles.cartItem,
        hoveredItem === item.id && styles.cartItemHovered,
      ]}
      onPressIn={() => setHoveredItem(item.id)}
      onPressOut={() => setHoveredItem(null)}
    >
      {/* Product Image */}
      <View style={styles.itemImageContainer}>
        {item.url ? (
          <Image
            source={{
              uri: item.url,
            }}
            style={styles.itemImage}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <MaterialIcons name="image" size={32} color="#D1D5DB" />
          </View>
        )}
      </View>

      {/* Item Details */}
      <View style={styles.itemContentContainer}>
        <View style={styles.itemNameRow}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.name}
          </Text>
        </View>

        {/* Kitchen & Category Badges */}
        <View style={styles.badgesRow}>
          {item.kitchen && (
            <View style={styles.kitchenBadge}>
              <MaterialIcons name="store" size={12} color="#E91E63" />
              <Text style={styles.badgeText}>{item.kitchen}</Text>
            </View>
          )}
          {item.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.badgeText}>{item.category}</Text>
            </View>
          )}
        </View>

        {/* Pricing Section */}
        <View style={styles.itemMetaRow}>
          <View style={styles.itemPriceSection}>
            <Text style={styles.itemPriceLabel}>Unit Price</Text>
            <Text style={styles.itemPrice}>
              ₱
              {Number(item.price || 0).toLocaleString("en-PH", {
                minimumFractionDigits: 2,
              })}
            </Text>
          </View>
          <View style={styles.itemTotalSection}>
            <Text style={styles.itemTotalLabel}>Total</Text>
            <Text style={styles.itemTotalPrice}>
              ₱
              {Number(calculateItemTotal(item)).toLocaleString("en-PH", {
                minimumFractionDigits: 2,
              })}
            </Text>
          </View>
        </View>
      </View>

      {/* Right Side: Quantity Control */}
      <View style={styles.itemRightContainer}>
        <View style={styles.quantityControl}>
          <TouchableOpacity
            style={styles.quantityBtn}
            onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
            disabled={isLoading}
          >
            <MaterialIcons name="remove" size={16} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityBtn}
            onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
            disabled={isLoading}
          >
            <MaterialIcons name="add" size={16} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Delete Button - Bottom Right */}
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => handleRemoveItem(item.id)}
        disabled={isLoading}
      >
        <MaterialIcons name="delete-outline" size={18} color="#DC2626" />
      </TouchableOpacity>
    </Pressable>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingSpinner}>
            <ActivityIndicator size="large" color="#E91E63" />
          </View>
          <Text style={styles.loadingText}>Loading your cart...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <MaterialIcons name="shopping-cart" size={64} color="#E91E63" />
          </View>
          <Text style={styles.emptyHeading}>Your Cart is Empty</Text>
          <Text style={styles.emptyText}>
            Explore our delicious menu and add items to your cart
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate("Home")}
          >
            <MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />
            <Text style={styles.browseButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <Text style={styles.itemCountBadge}>
          {items.length} {items.length === 1 ? "item" : "items"}
        </Text>
      </View>

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={16} color="#DC2626" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Cart Items List */}
      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
      />

      {/* Footer with Totals and Checkout */}
      <View style={styles.footer}>
        {/* Delivery Info */}
        <View style={styles.deliveryInfo}>
          <View style={styles.deliveryIconContainer}>
            <MaterialIcons name="local-shipping" size={16} color="#10B981" />
          </View>
          <View style={styles.deliveryTextContainer}>
            <Text style={styles.deliveryLabel}>Delivery</Text>
            <Text style={styles.deliveryValue}>FREE</Text>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              ₱
              {Number(calculateCartTotal()).toLocaleString("en-PH", {
                minimumFractionDigits: 2,
              })}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>
              ₱
              {Number(calculateCartTotal()).toLocaleString("en-PH", {
                minimumFractionDigits: 2,
              })}
            </Text>
          </View>
        </View>

        {/* Checkout Button */}
        <TouchableOpacity
          style={[styles.checkoutButton, isLoading && styles.buttonDisabled]}
          onPress={() => navigation.navigate("Checkout")}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
              <MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  listContent: {
    paddingHorizontal: 14,
    paddingTop: 0,
    paddingBottom: 300,
    gap: 10,
  },

  // Header Section
  headerSection: {
    paddingHorizontal: 18,
    paddingTop: 0,
    paddingBottom: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 0,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  itemCountBadge: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
    marginTop: 0,
  },

  // Cart Item Card - Beautiful Modern Design
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 2,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
    position: "relative",
  },
  cartItemHovered: {
    borderColor: "#CBD5E1",
    shadowOpacity: 0.08,
    elevation: 4,
  },

  itemImageContainer: {
    width: 88,
    height: 88,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    flexShrink: 0,
  },
  itemImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    backgroundColor: "#F1F5F9",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },

  itemContentContainer: {
    flex: 1,
    justifyContent: "flex-start",
    marginRight: 10,
  },
  itemNameRow: {
    marginBottom: 6,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    lineHeight: 20,
  },

  // Refined Badges
  badgesRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 8,
    flexWrap: "wrap",
  },
  kitchenBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    backgroundColor: "#F0F4F8",
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: "#D1D5DB",
  },
  categoryBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    backgroundColor: "#EFF6FF",
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: "#BFDBFE",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#1E293B",
  },

  itemMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  itemPriceSection: {
    flex: 1,
  },
  itemPriceLabel: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "500",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  itemTotalSection: {
    flex: 1,
    alignItems: "flex-end",
  },
  itemTotalLabel: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "500",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  itemTotalPrice: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563EB",
  },

  itemRightContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 0,
    justifyContent: "center",
    marginLeft: 10,
  },

  // Sleek Quantity Control
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 3,
    paddingVertical: 3,
    backgroundColor: "#F8FAFC",
    gap: 0,
  },
  quantityBtn: {
    width: 30,
    height: 30,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 0,
  },
  quantityBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#64748B",
  },
  quantity: {
    marginHorizontal: 4,
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
    minWidth: 18,
    textAlign: "center",
  },

  // Clean Remove Button
  removeBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 12,
    right: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  removeBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#DC2626",
  },

  // Stunning Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  emptyIconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
    borderWidth: 2,
    borderColor: "#BFDBFE",
  },
  emptyHeading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 10,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 40,
    textAlign: "center",
    lineHeight: 21,
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  loadingSpinner: {
    marginBottom: 18,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#64748B",
    fontWeight: "500",
  },

  // Modern Error
  errorContainer: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  errorText: {
    color: "#7F1D1D",
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },

  // Premium Footer
  footer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingHorizontal: 14,
    paddingVertical: 10,
    paddingBottom: 16,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 5,
  },

  // Modern Delivery Info
  deliveryInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  deliveryIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 7,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  deliveryTextContainer: {
    flex: 1,
  },
  deliveryLabel: {
    fontSize: 10,
    color: "#059669",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  deliveryValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#059669",
    marginTop: 1,
  },

  // Refined Summary
  summarySection: {
    marginBottom: 14,
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 13,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 7,
  },
  summaryLabel: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 13,
    color: "#0F172A",
    fontWeight: "700",
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 8,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 7,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2563EB",
  },

  // Beautiful Checkout Button
  checkoutButton: {
    backgroundColor: "#E91E63",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    shadowColor: "#E91E63",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  checkoutButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.2,
  },

  // Elegant Browse Button
  browseButton: {
    backgroundColor: "#E91E63",
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#E91E63",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  browseButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
    textAlign: "center",
  },
});
