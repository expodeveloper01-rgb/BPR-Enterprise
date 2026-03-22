import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import useCart from "@/hooks/use-carts";

export const PopularContent = ({ data }) => {
  const cart = useCart();

  const addToCart = () => {
    cart.addItem({ ...data, qty: 1 });
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
      {/* Image */}
      <Link to={`/menu/${data.id}`} className="block relative overflow-hidden bg-gray-50 aspect-square">
        <img
          alt={data.name}
          src={data.images[0]?.url}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={(e) => { e.preventDefault(); addToCart(); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
        </button>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Badges */}
        <div className="flex flex-wrap gap-1">
          {data.cuisine && (
            <span className="rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10px] font-semibold capitalize">
              {data.cuisine}
            </span>
          )}
          {data.category && (
            <span className="rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-[10px] font-semibold capitalize">
              {data.category}
            </span>
          )}
          {data.size && (
            <span className="rounded-full bg-yellow-50 text-yellow-700 px-2 py-0.5 text-[10px] font-semibold capitalize">
              {data.size}
            </span>
          )}
        </div>

        <Link to={`/menu/${data.id}`}>
          <h3 className="font-semibold text-neutral-800 leading-snug hover:underline line-clamp-2">
            {data.name}
          </h3>
        </Link>

        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-neutral-900">
            ₱{Number(data.price).toLocaleString()}
          </span>
          <Link to={`/menu/${data.id}`}>
            <Button size="sm" className="rounded-full bg-black text-white hover:bg-black/80 px-4">
              Buy Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PopularContent;
