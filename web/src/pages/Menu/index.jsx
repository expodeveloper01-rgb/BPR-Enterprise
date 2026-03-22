import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import getCategories from "@/actions/get-categories";
import getProducts from "@/actions/get-products";
import getSizes from "@/actions/get-sizes";
import getKitchens from "@/actions/get-kitchens";
import getCuisines from "@/actions/get-cuisines";
import Container from "@/components/container";
import FilterContainer from "@/components/filter-container";
import CategoryFilters from "./components/CategoryFilters";
import SizeFilters from "./components/SizeFilters";
import KitchenFilters from "./components/KitchenFilters";
import CuisineFilters from "./components/CuisineFilters";
import PageContent from "./components/PageContent";
import { SlidersHorizontal, X } from "lucide-react";

const MenuPage = () => {
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [kitchens, setKitchens] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [products, setProducts] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories);
    getSizes().then(setSizes);
    getKitchens().then(setKitchens);
    getCuisines().then(setCuisines);
  }, []);

  useEffect(() => {
    getProducts({
      size: searchParams.get("size") || undefined,
      isFeatured: searchParams.get("isFeatured") || undefined,
      cuisine: searchParams.get("cuisine") || undefined,
      category: searchParams.get("category") || undefined,
      kitchen: searchParams.get("kitchen") || undefined,
    }).then(setProducts);
  }, [searchParams]);

  const filterPanel = (
    <FilterContainer>
      <CategoryFilters categories={categories} />
      <SizeFilters sizes={sizes} />
      <KitchenFilters kitchens={kitchens} />
      <CuisineFilters cuisines={cuisines} />
    </FilterContainer>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative w-72 bg-white h-full overflow-y-auto p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-neutral-800">Filters</span>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="text-neutral-500 hover:text-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {filterPanel}
          </div>
        </div>
      )}

      <Container className="px-4 md:px-12 py-6">
        {/* Mobile filter button */}
        <div className="flex md:hidden mb-4">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium text-neutral-700 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Desktop sidebar */}
          <div className="hidden md:block col-span-2 border-r border-gray-100 pr-4">
            {filterPanel}
          </div>

          {/* Products */}
          <div className="col-span-12 md:col-span-10">
            <PageContent products={products} />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default MenuPage;
