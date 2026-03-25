import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Banknote,
  Truck,
  ChevronRight,
  Home,
  CheckCircle2,
  Copy,
} from "lucide-react";
import apiClient from "@/lib/api-client";
import useCart from "@/hooks/use-carts";
import useAuth from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Container from "@/components/container";

const BANK_DETAILS = {
  name: "Uncle Brew Cebu PH",
  bank: "BDO (Banco de Oro)",
  number: "1234 5678 9012",
  gcash: "0912 345 6789",
};

const inputCls =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/20 transition";
const labelCls = "block text-sm font-medium text-neutral-700 mb-1.5";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const cart = useCart();
  const { user } = useAuth();
  const [method, setMethod] = useState("cod"); // "cod" | "bank_transfer"
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [refNumber, setRefNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const totalPrice = cart.items.reduce(
    (t, i) => t + Number(i.price * i.qty),
    0,
  );

  if (!user) {
    return (
      <Container className="px-4 md:px-12 py-20 text-center">
        <p className="text-muted-foreground mb-4">
          Please sign in to place an order.
        </p>
        <Link to="/sign-in">
          <Button className="rounded-full bg-black text-white">Sign In</Button>
        </Link>
      </Container>
    );
  }

  if (cart.items.length === 0 && !success) {
    navigate("/cart");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (method === "cod") {
        const { data } = await apiClient.post("/checkout/cod", {
          phone,
          address,
        });
        setOrderId(data.orderId);
      } else {
        const { data } = await apiClient.post("/checkout/bank-transfer", {
          phone,
          address,
          referenceNumber: refNumber,
        });
        setOrderId(data.orderId);
      }
      cart.removeAll();
      setSuccess(true);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Order failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <Container className="px-4 md:px-12 py-20">
        <div className="max-w-md mx-auto text-center space-y-5">
          <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-800">Order Placed!</h1>
          {method === "cod" ? (
            <p className="text-muted-foreground text-sm">
              Your Cash on Delivery order has been received. Pay when your order
              arrives.
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">
              Your order is pending payment verification. We&apos;ll confirm
              once the transfer is verified.
            </p>
          )}
          {orderId && (
            <p className="text-xs text-neutral-500">
              Order ID:{" "}
              <span className="font-mono font-semibold">{orderId}</span>
            </p>
          )}
          <div className="flex gap-3 justify-center pt-2">
            <Link to="/uncle-brew/orders">
              <Button className="rounded-full bg-black text-white hover:bg-black/80 px-6">
                View Orders
              </Button>
            </Link>
            <Link to="/uncle-brew/menu">
              <Button variant="outline" className="rounded-full px-6">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  // ── Checkout form ───────────────────────────────────────────────────────────
  return (
    <Container className="px-4 md:px-12 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
        <Link
          to="/uncle-brew"
          className="flex items-center gap-1 hover:text-neutral-800 transition"
        >
          <Home className="w-4 h-4" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link
          to="/uncle-brew/cart"
          className="hover:text-neutral-800 transition"
        >
          Cart
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-neutral-800 font-medium">Checkout</span>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-8">
        Checkout
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left — details + payment */}
          <div className="flex-1 space-y-6">
            {/* Delivery details */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <h2 className="font-semibold text-neutral-800">
                Delivery Details
              </h2>
              <div>
                <label className={labelCls}>Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+63 912 345 6789"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Delivery Address</label>
                <textarea
                  required
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House / Unit No., Street, Barangay, City"
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <h2 className="font-semibold text-neutral-800">Payment Method</h2>

              <div className="grid grid-cols-2 gap-3">
                {/* COD */}
                <button
                  type="button"
                  onClick={() => setMethod("cod")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition text-sm font-medium ${
                    method === "cod"
                      ? "border-black bg-black text-white"
                      : "border-gray-200 text-neutral-700 hover:border-gray-300"
                  }`}
                >
                  <Truck className="w-6 h-6" />
                  Cash on Delivery
                </button>

                {/* Bank Transfer */}
                <button
                  type="button"
                  onClick={() => setMethod("bank_transfer")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition text-sm font-medium ${
                    method === "bank_transfer"
                      ? "border-black bg-black text-white"
                      : "border-gray-200 text-neutral-700 hover:border-gray-300"
                  }`}
                >
                  <Banknote className="w-6 h-6" />
                  Bank Transfer
                </button>
              </div>

              {/* COD info */}
              {method === "cod" && (
                <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-sm text-amber-800">
                  <p className="font-medium mb-0.5">Cash on Delivery</p>
                  <p className="text-amber-700">
                    Pay with cash when your order is delivered to your address.
                    Please prepare the exact amount.
                  </p>
                </div>
              )}

              {/* Bank Transfer form */}
              {method === "bank_transfer" && (
                <div className="space-y-4">
                  {/* Bank details card */}
                  <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 space-y-2 text-sm">
                    <p className="font-semibold text-blue-900">
                      Transfer to any of the following:
                    </p>
                    <div className="space-y-1 text-blue-800">
                      <div className="flex items-center justify-between">
                        <span>
                          <span className="font-medium">BDO</span> —{" "}
                          {BANK_DETAILS.number}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(BANK_DETAILS.number);
                            toast.success("Copied!");
                          }}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>
                          <span className="font-medium">GCash</span> —{" "}
                          {BANK_DETAILS.gcash}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(BANK_DETAILS.gcash);
                            toast.success("Copied!");
                          }}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-blue-700 pt-1">
                        Account Name:{" "}
                        <span className="font-medium">{BANK_DETAILS.name}</span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>
                      Reference / Transaction Number{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required={method === "bank_transfer"}
                      value={refNumber}
                      onChange={(e) => setRefNumber(e.target.value)}
                      placeholder="e.g. 1234567890"
                      className={inputCls}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter the reference number from your transfer
                      confirmation.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right — order summary */}
          <div className="w-full lg:w-80 shrink-0 sticky top-24">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h2 className="text-lg font-semibold text-neutral-800">
                Order Summary
              </h2>
              <Separator />

              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm gap-3"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={item.images?.[0]?.url}
                        alt={item.name}
                        className="w-9 h-9 rounded-lg object-cover shrink-0 bg-gray-100"
                      />
                      <span className="truncate text-neutral-700">
                        {item.name}
                      </span>
                    </div>
                    <span className="shrink-0 text-neutral-800 font-medium">
                      ₱{(item.price * item.qty).toLocaleString()}
                      {item.qty > 1 && (
                        <span className="text-muted-foreground font-normal">
                          {" "}
                          ×{item.qty}
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-1.5 text-sm">
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
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-black text-white hover:bg-black/80 font-semibold"
              >
                {loading
                  ? "Placing Order…"
                  : method === "cod"
                    ? "Place COD Order"
                    : "Confirm Bank Transfer"}
              </Button>

              <Link
                to="/uncle-brew/cart"
                className="block text-center text-xs text-muted-foreground hover:text-neutral-800 transition"
              >
                ← Back to cart
              </Link>
            </div>
          </div>
        </div>
      </form>
    </Container>
  );
}
