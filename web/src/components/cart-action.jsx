import useCart from "@/hooks/use-carts";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

const CartActionButton = ({ scrolled }) => {
  const [mounted, setMounted] = useState(false);
  const cart = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="ml-4 flex items-center justify-center gap-x-4">
      <Button
        className={cn(
          "rounded-full h-9",
          scrolled ? "bg-black" : "bg-white/90 hover:bg-white",
        )}
        onClick={() => navigate("/cart")}
      >
        <ShoppingBag className={cn("w-4 h-4", scrolled ? "" : "text-black")} />
        <span className={cn("text-sm ml-2", scrolled ? "" : "text-black")}>
          {cart.items.length}
        </span>
      </Button>
    </div>
  );
};

export default CartActionButton;
