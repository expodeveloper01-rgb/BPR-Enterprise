import { Button } from "@/components/ui/button";
import { CardSkeletons } from "@/components/ui/skeleton";
import useCart from "@/hooks/use-carts";
import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import CartItem from "./CartItem";
import { Separator } from "@/components/ui/separator";

const CartContent = ({ store = "uncle-brew" }) => {
  const cart = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hasShownToast = useRef(false);

  const totalPrice = cart.items.reduce((total, item) => {
    return total + Number(item.price * item.qty);
  }, 0);

  // Fetch fresh cart data when component mounts
  useEffect(() => {
    cart.fetchCart();
  }, []);

  // Handle page visibility - refetch when user switches back to browser tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        cart.fetchCart();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (searchParams.get("success") && !hasShownToast.current) {
      toast.success("Payment completed!");
      cart.removeAll();
      hasShownToast.current = true;
    }
    if (searchParams.get("canceled")) {
      toast.error("Checkout was cancelled.");
    }
  }, [searchParams]);

  const onCheckOut = () => {
    navigate(`/${store}/checkout`);
  };

  // Show loading skeleton while cart is loading
  if (!cart.loaded) {
    return (
      <div className="w-full">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-6">
          Cart
          <span className="ml-2 text-base font-normal text-muted-foreground">
            (loading...)
          </span>
        </h1>
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 w-full">
            <CardSkeletons count={3} />
          </div>
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-24" />
              <Separator />
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </div>
              <Separator />
              <div className="h-6 bg-gray-200 rounded animate-pulse" />
              <div className="h-11 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-5">
        <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center">
          <ShoppingBag className="w-9 h-9 text-neutral-400" />
        </div>
        <h2 className="text-2xl font-semibold text-neutral-700">
          Your cart is empty
        </h2>
        <p className="text-muted-foreground text-sm">
          Browse our menu and add items to get started.
        </p>
        <Link to={`/stores`}>
          <Button className="rounded-full px-6 bg-black text-white hover:bg-black/80">
            Browse Menu
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-800">
          Cart
          <span className="ml-2 text-base font-normal text-muted-foreground">
            ({cart.items.length} {cart.items.length === 1 ? "item" : "items"})
          </span>
        </h1>
        <button
          onClick={cart.removeAll}
          className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear all
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Cart items */}
        <div className="flex-1 w-full space-y-3">
          {cart.items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Order summary sidebar */}
        <div className="w-full lg:w-80 shrink-0 sticky top-24">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-neutral-800">
              Order Summary
            </h2>
            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₱{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span className="text-emerald-600 font-medium">Free</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between font-bold text-neutral-800 text-base">
              <span>Total</span>
              <span>₱{totalPrice.toLocaleString()}</span>
            </div>

            <Button
              onClick={onCheckOut}
              className="w-full h-11 rounded-xl bg-black text-white hover:bg-black/80 font-semibold flex items-center gap-2"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartContent;
