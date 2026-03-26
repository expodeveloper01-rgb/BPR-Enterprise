import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import getCategories from "@/actions/get-categories";
import getProducts from "@/actions/get-products";
import getKitchens from "@/actions/get-kitchens";
import Container from "@/components/container";
import FilterContainer from "@/components/filter-container";
import CategoryFilters from "@/pages/Menu/components/CategoryFilters";
import PageContent from "@/pages/Menu/components/PageContent";
import { ProductCardSkeleton, FilterSkeletons } from "@/components/ui/skeleton";
import { SlidersHorizontal, X } from "lucide-react";

const DiomedesMenuPage = () => {
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [kitchens, setKitchens] = useState([]);
  const [products, setProducts] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    setLoadingFilters(true);
    Promise.all([
      getCategories().then(setCategories),
      getKitchens().then(setKitchens),
    ]).finally(() => setLoadingFilters(false));
  }, []);

  useEffect(() => {
    setLoadingProducts(true);
    // Find Diomedes kitchen ID
    const diomedes = kitchens.find((k) => k.name === "Diomedes");
    const kitchenId = diomedes?.id;

    getProducts({
      category: searchParams.get("category") || undefined,
      kitchen: kitchenId,
    })
      .then(setProducts)
      .finally(() => setLoadingProducts(false));
  }, [searchParams, kitchens]);

  return (
    <main className="min-h-screen bg-white pt-12 pb-12">
      <Container className="px-4 md:px-12">
        {/* Header Section */}
        <div className="mb-12">
          <div className="relative overflow-hidden rounded-2xl p-8 md:p-12 border border-amber-100 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50">
            {/* Blurry background image */}
            <div
              className="absolute inset-0 bg-cover bg-center blur-sm opacity-60"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&h=500&fit=crop")',
              }}
            />
            <div className="relative z-10 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 uppercase tracking-wide">
                Our Artisan Collection
              </h1>
              <p className="text-lg text-neutral-700 leading-relaxed">
                Discover our freshly baked pastries, artisan breads, and custom
                cakes. Every item is crafted with premium ingredients and love.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Filter Button - Above Breadcrumbs */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium transition-colors text-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="flex gap-6">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-48 flex-shrink-0">
            <FilterContainer
              title="Filter by Category"
              isLoading={loadingFilters}
            >
              {loadingFilters ? (
                <FilterSkeletons />
              ) : (
                <CategoryFilters
                  categories={categories}
                  activeCategory={searchParams.get("category")}
                />
              )}
            </FilterContainer>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Products Grid */}
            {loadingProducts || loadingFilters ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <PageContent products={products} />
            )}
          </div>
        </div>

        {/* Mobile Filters Sidebar Overlay - Outside flex container */}
        {mobileFiltersOpen && (
          <div className="lg:hidden fixed inset-0 z-40">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 transition-opacity"
              onClick={() => setMobileFiltersOpen(false)}
            />
            {/* Sidebar */}
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl overflow-y-auto animate-in slide-in-from-left-96 duration-300">
              <div className="sticky top-0 bg-white border-b border-amber-200 p-4 flex items-center justify-between">
                <h3 className="font-semibold text-neutral-800 text-lg">
                  Filters
                </h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 hover:bg-amber-100 rounded transition-colors"
                >
                  <X className="w-6 h-6 text-neutral-600" />
                </button>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <h4 className="font-semibold text-neutral-800 mb-3">
                    Categories
                  </h4>
                  {loadingFilters ? (
                    <FilterSkeletons />
                  ) : (
                    <CategoryFilters
                      categories={categories}
                      activeCategory={searchParams.get("category")}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </main>
  );
};

export default DiomedesMenuPage;
