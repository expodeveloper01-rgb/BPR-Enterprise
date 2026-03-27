import { PackageOpen } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import OrderItem from "./OrderItem";

const PageContent = ({ orders, onViewDetail }) => {
  const { pathname } = useLocation();
  const isUncleBrew = pathname.startsWith("/uncle-brew");
  const isDiomedes = pathname.startsWith("/diomedes");
  const store = isUncleBrew
    ? "uncle-brew"
    : isDiomedes
      ? "diomedes"
      : "uncle-brew";

  // Split orders by kitchen
  const expandedOrders = orders.flatMap((order) => {
    if (!order.orderItems || order.orderItems.length === 0) {
      return [order];
    }

    // Group items by kitchenId
    const itemsByKitchen = new Map();
    for (const item of order.orderItems) {
      const kitchenId = item.kitchenId || "unknown";
      if (!itemsByKitchen.has(kitchenId)) {
        itemsByKitchen.set(kitchenId, []);
      }
      itemsByKitchen.get(kitchenId).push(item);
    }

    // Create separate order card for each kitchen
    if (itemsByKitchen.size === 1) {
      // Single kitchen, return as-is
      return [order];
    } else {
      // Multiple kitchens, create separate cards
      return Array.from(itemsByKitchen.entries()).map(([kitchenId, items]) => ({
        ...order,
        orderItems: items,
        _kitchenId: kitchenId, // Mark as split order for display purposes
      }));
    }
  });

  if (expandedOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center">
          <PackageOpen className="w-7 h-7 text-neutral-400" />
        </div>
        <p className="text-lg font-semibold text-neutral-700">No orders yet</p>
        <p className="text-sm text-muted-foreground">
          Your completed orders will appear here.
        </p>
        <Link to={`/${store}/menu`}>
          <Button className="rounded-full px-6 bg-black text-white hover:bg-black/80">
            Start Brewing Your Coffee
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expandedOrders.map((order, idx) => (
        <OrderItem
          key={`${order.id}-${order._kitchenId || idx}`}
          order={order}
          onViewDetail={onViewDetail}
        />
      ))}
    </div>
  );
};

export default PageContent;
