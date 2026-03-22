import { PackageOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import OrderItem from "./OrderItem";

const PageContent = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center">
          <PackageOpen className="w-7 h-7 text-neutral-400" />
        </div>
        <p className="text-lg font-semibold text-neutral-700">No orders yet</p>
        <p className="text-sm text-muted-foreground">Your completed orders will appear here.</p>
        <Link to="/menu">
          <Button className="rounded-full px-6 bg-black text-white hover:bg-black/80">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <OrderItem key={order.id} order={order} />
      ))}
    </div>
  );
};

export default PageContent;
