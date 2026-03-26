import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useCart from "@/hooks/use-carts";
import useAuth from "@/hooks/use-auth";
import getSizes from "@/actions/get-sizes";
import getCategories from "@/actions/get-categories";
import getCuisines from "@/actions/get-cuisines";
import getKitchens from "@/actions/get-kitchens";
import toast from "react-hot-toast";
import { Minus, Plus, ShoppingCart } from "lucide-react";

const Info = ({ product }) => {
  const [qty, setQty] = useState(1);
  const [sizes, setSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [tags, setTags] = useState([]);
  const cart = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      getSizes(),
      getCategories(),
      getCuisines(),
      getKitchens(),
    ]).then(([allSizes, allCategories, allCuisines, allKitchens]) => {
      // Filter sizes to only include those selected for this product
      const filteredSizes =
        product?.sizeIds && product.sizeIds.length > 0
          ? allSizes.filter((size) =>
              product.sizeIds.some((id) => String(id) === String(size.id)),
            )
          : []; // Show no sizes if product has no sizeIds
      setSizes(filteredSizes);

      // Get all selected categories, cuisines, kitchens
      const selectedCategories =
        product?.categoryIds && product.categoryIds.length > 0
          ? allCategories.filter((cat) =>
              product.categoryIds.some((id) => String(id) === String(cat.id)),
            )
          : [];

      const selectedCuisines =
        product?.cuisineIds && product.cuisineIds.length > 0
          ? allCuisines.filter((cui) =>
              product.cuisineIds.some((id) => String(id) === String(cui.id)),
            )
          : [];

      const selectedKitchens =
        product?.kitchenIds && product.kitchenIds.length > 0
          ? allKitchens.filter((kit) =>
              product.kitchenIds.some((id) => String(id) === String(kit.id)),
            )
          : [];

      // Build tags from all selected items
      const allTags = [
        ...selectedCuisines.map((c) => c.name),
        ...selectedCategories.map((c) => c.name),
        ...selectedKitchens.map((k) => k.name),
      ];
      setTags(allTags);
    });
  }, [product]);

  const addToCart = () => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      navigate("/sign-in");
      return;
    }

    // Only require size if product has sizes
    if (sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    cart.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images || [],
      sizeId: selectedSize?.id,
      sizeName: selectedSize?.name,
      category: product.category?.name,
      cuisine: product.cuisine?.name,
      kitchen: product.kitchen?.name,
      qty,
    });
    toast.success("Added to cart");
    setSelectedSize(null);
    setQty(1);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Name + tags */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 leading-tight">
          {product.name}
        </h1>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-neutral-600 capitalize"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Price */}
      <div>
        <p className="text-xs text-neutral-400 uppercase tracking-widest font-medium mb-1">
          Price
        </p>
        <p className="text-4xl font-bold text-neutral-900">
          ₱
          {Number(product.price).toLocaleString("en-PH", {
            minimumFractionDigits: 2,
          })}
        </p>
      </div>

      {/* Description */}
      {product.description && (
        <p className="text-sm text-neutral-600 leading-relaxed">
          {product.description}
        </p>
      )}

      <Separator />

      {/* Size Selection - only show if sizes exist */}
      {sizes.length > 0 && (
        <>
          <div>
            <p className="text-xs text-neutral-400 uppercase tracking-widest font-medium mb-3">
              Size *
            </p>
            <div className="grid grid-cols-3 gap-2 md:grid-cols-5">
              {sizes.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`px-2 py-1.5 rounded-md border font-medium text-sm transition-all ${
                    selectedSize?.id === size.id
                      ? "border-black bg-black text-white"
                      : "border-gray-200 text-neutral-700 hover:border-gray-300"
                  }`}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>

          <Separator />
        </>
      )}

      {/* Quantity */}
      <div>
        <p className="text-xs text-neutral-400 uppercase tracking-widest font-medium mb-3">
          Quantity
        </p>
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
        onClick={addToCart}
        className="w-full py-6 text-base font-semibold bg-black text-white hover:bg-black/80 rounded-full flex items-center justify-center gap-3"
      >
        <ShoppingCart className="w-5 h-5" />
        Add to Cart
      </Button>
    </div>
  );
};

export default Info;
