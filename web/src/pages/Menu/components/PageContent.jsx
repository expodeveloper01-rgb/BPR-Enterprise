import { PopularContent } from "@/components/popular-content";
import { ChevronRight, Home, X, ShoppingBag } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import qs from "query-string";

const PageContent = ({ products }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentParams = Object.fromEntries(searchParams.entries());

  const handleRemove = (param) => {
    if (Object.prototype.hasOwnProperty.call(currentParams, param)) {
      const newParams = { ...currentParams };
      delete newParams[param];
      navigate(qs.stringifyUrl({ url: "/menu", query: newParams }));
    }
  };

  const activeFilters = Object.entries(currentParams);

  return (
    <div className="pt-4 pb-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
        <Link to="/" className="flex items-center gap-1 hover:text-neutral-800 transition-colors">
          <Home className="w-4 h-4" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/menu" className="hover:text-neutral-800 transition-colors">
          Menu
        </Link>
        {searchParams.get("category") && (
          <>
            <ChevronRight className="w-4 h-4" />
            <span className="text-neutral-800 font-medium capitalize">
              {searchParams.get("category")}
            </span>
          </>
        )}
      </nav>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {activeFilters.map(([key, value]) => (
            <button
              key={key}
              onClick={() => handleRemove(key)}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-neutral-100 text-neutral-700 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <span className="capitalize">{value}</span>
              <X className="w-3 h-3" />
            </button>
          ))}
        </div>
      )}

      {/* Products grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <PopularContent data={product} key={product.id} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center">
            <ShoppingBag className="w-7 h-7 text-neutral-400" />
          </div>
          <p className="text-lg font-semibold text-neutral-700">No products found</p>
          <p className="text-sm text-muted-foreground">Try adjusting or clearing your filters.</p>
        </div>
      )}
    </div>
  );
};

export default PageContent;
