import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useCart from "@/hooks/use-carts";
import { Minus, Plus, ShoppingCart } from "lucide-react";

const Info = ({ product }) => {
  const [qty, setQty] = useState(1);
  const cart = useCart();

  const addToCart = (data) => {
    cart.addItem({ ...data, qty });
  };

  const tags = [product.cuisine, product.category, product.kitchen, product.size].filter(Boolean);

  return (
    <div className="flex flex-col gap-5">
      {/* Name + tags */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 leading-tight">{product.name}</h1>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-neutral-600 capitalize">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Price */}
      <div>
        <p className="text-xs text-neutral-400 uppercase tracking-widest font-medium mb-1">Price</p>
        <p className="text-4xl font-bold text-neutral-900">₱{Number(product.price).toLocaleString("en-PH", { minimumFractionDigits: 2 })}</p>
      </div>

      {/* Description */}
      {product.description && (
        <p className="text-sm text-neutral-600 leading-relaxed">{product.description}</p>
      )}

      <Separator />

      {/* Quantity */}
      <div>
        <p className="text-xs text-neutral-400 uppercase tracking-widest font-medium mb-3">Quantity</p>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-6 text-center text-lg font-semibold">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add to Cart */}
      <Button
        onClick={() => addToCart(product)}
        className="w-full py-6 text-base font-semibold bg-black text-white hover:bg-black/80 rounded-full flex items-center justify-center gap-3"
      >
        <ShoppingCart className="w-5 h-5" />
        Add to Cart
      </Button>
    </div>
  );
};

export default Info;
