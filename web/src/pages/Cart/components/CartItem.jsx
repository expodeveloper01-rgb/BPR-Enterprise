import useCart from "@/hooks/use-carts";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const CartItem = ({ item }) => {
  const [qty, setQty] = useState(item.qty ?? 1);
  const cart = useCart();

  const increment = () => {
    const next = qty + 1;
    setQty(next);
    cart.updateItemQuantity(item.id, next);
  };

  const decrement = () => {
    if (qty <= 1) return;
    const next = qty - 1;
    setQty(next);
    cart.updateItemQuantity(item.id, next);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
      {/* Image */}
      <div className="w-20 h-20 shrink-0 rounded-xl bg-gray-50 overflow-hidden">
        <img
          alt={item.name}
          src={item.images[0].url}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Name + badges */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-neutral-800 truncate">{item.name}</h3>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {item.cuisine && (
            <span className="rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10px] font-semibold capitalize">
              {item.cuisine}
            </span>
          )}
          {item.category && (
            <span className="rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-[10px] font-semibold capitalize">
              {item.category}
            </span>
          )}
          {item.kitchen && (
            <span className="rounded-full bg-orange-50 text-orange-700 px-2 py-0.5 text-[10px] font-semibold capitalize">
              {item.kitchen}
            </span>
          )}
          {item.size && (
            <span className="rounded-full bg-yellow-50 text-yellow-700 px-2 py-0.5 text-[10px] font-semibold capitalize">
              {item.size}
            </span>
          )}
        </div>
      </div>

      {/* Qty controls */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={decrement}
          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-6 text-center text-sm font-semibold">{qty}</span>
        <button
          onClick={increment}
          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {/* Price */}
      <span className="text-sm font-bold text-neutral-800 shrink-0 w-20 text-right">
        ₱{(item.price * qty).toLocaleString()}
      </span>

      {/* Remove */}
      <button
        onClick={() => cart.removeItem(item.id)}
        className="shrink-0 text-muted-foreground hover:text-red-500 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CartItem;
