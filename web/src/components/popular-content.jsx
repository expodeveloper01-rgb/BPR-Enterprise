import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import useAuth from "@/hooks/use-auth";
import toast from "react-hot-toast";

export const PopularContent = ({ data }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isDiomedes = pathname.startsWith("/diomedes");
  const store = isDiomedes ? "diomedes" : "uncle-brew";

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to add items to cart");
      navigate("/sign-in");
      return;
    }
    // Navigate to product details where they can select size
    navigate(`/${store}/menu/${data.id}`);
  };

  return (
    <div className="group bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full">
      {/* Image */}
      <Link
        to={`/${store}/menu/${data.id}`}
        className="block relative overflow-hidden bg-gray-50 aspect-square"
      >
        <img
          alt={data.name}
          src={data.images[0]?.url}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={handleAddToCart}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
        >
          <ShoppingCart className="w-3 h-3" />
        </button>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 gap-2">
        {/* Badges */}
        {/* <div className="flex flex-wrap gap-0.5">
          {data.cuisine && (
            <span className="rounded-full bg-emerald-50 text-emerald-700 px-1.5 py-0.5 text-[9px] font-semibold capitalize">
              {data.cuisine}
            </span>
          )}
          {data.category && (
            <span className="rounded-full bg-blue-50 text-blue-700 px-1.5 py-0.5 text-[9px] font-semibold capitalize">
              {data.category}
            </span>
          )}
          {data.size && (
            <span className="rounded-full bg-yellow-50 text-yellow-700 px-1.5 py-0.5 text-[9px] font-semibold capitalize">
              {data.size}
            </span>
          )}
        </div> */}

        <Link to={`/${store}/menu/${data.id}`}>
          <h3 className="font-semibold text-sm text-neutral-800 leading-snug hover:underline line-clamp-2">
            {data.name}
          </h3>
        </Link>

        {data.description && (
          <p className="text-xs text-neutral-600 line-clamp-2">
            {data.description}
          </p>
        )}

        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
          <span className="text-base font-bold text-neutral-900">
            ₱{Number(data.price).toLocaleString()}
          </span>
          <Link to={`/${store}/menu/${data.id}`}>
            <Button
              size="sm"
              className="rounded-full bg-black text-white hover:bg-black/80 px-3 text-xs h-7"
            >
              Buy
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PopularContent;
