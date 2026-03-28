/**
 * Get the latest status title from status history
 * Falls back to order_status/delivery_status if history is not available
 */
export const getLatestStatusTitle = (order) => {
  // Check if there's status history with entries
  if (
    order.statusHistory &&
    Array.isArray(order.statusHistory) &&
    order.statusHistory.length > 0
  ) {
    // Get the last entry
    const latestStatus = order.statusHistory[order.statusHistory.length - 1];
    if (latestStatus.title) {
      return latestStatus.title;
    }
  }

  // Fallback to standard display names based on order/delivery status
  // Check order_status FIRST for confirmation states (highest priority)
  if (order.order_status === "pending_confirmation") {
    return "Order Pending - Waiting for confirmation";
  }

  if (order.order_status === "confirmed") {
    return "Order Confirmed - Waiting for pickup";
  }

  if (order.order_status === "cancelled") {
    return "Order Cancelled";
  }

  // Then check delivery_status for rider-related states
  if (order.delivery_status === "pickup-pending") {
    return "Pickup Pending";
  }

  if (order.delivery_status === "in-transit") {
    return "Order on the way";
  }

  if (order.delivery_status === "delivered") {
    return "Order Delivered";
  }

  if (order.delivery_status === "pending") {
    return "Waiting for rider";
  }

  // Then check other order_status values
  if (order.order_status === "delivered") {
    return "Order Delivered";
  }

  if (order.order_status === "processing") {
    return "Order Processing";
  }

  if (order.order_status === "shipped") {
    return "Order on the way";
  }

  return "Order Status Unknown";
};

/**
 * Get the latest status message from status history
 */
export const getLatestStatusMessage = (order) => {
  if (
    order.statusHistory &&
    Array.isArray(order.statusHistory) &&
    order.statusHistory.length > 0
  ) {
    const latestStatus = order.statusHistory[order.statusHistory.length - 1];
    if (latestStatus.message) {
      return latestStatus.message;
    }
  }
  return order.statusMessage || "";
};
