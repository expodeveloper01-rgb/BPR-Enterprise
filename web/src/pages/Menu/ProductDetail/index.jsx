import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import getProduct from "@/actions/get-product";
import getProducts from "@/actions/get-products";
import Box from "@/components/box";
import Container from "@/components/container";
import { ProductDetailSkeleton } from "@/components/ui/skeleton";
import { ChevronRight, Home } from "lucide-react";
import Gallery from "./components/gallery/Gallery";
import Info from "./components/Info";
import SuggestedList from "./components/SuggestedList";

const ProductPage = () => {
  const { productId } = useParams();
  const { pathname } = useLocation();
  const isUncleBrew = pathname.startsWith("/uncle-brew");
  const isDiomedes = pathname.startsWith("/diomedes");
  const store = isUncleBrew
    ? "uncle-brew"
    : isDiomedes
      ? "diomedes"
      : "uncle-brew";

  const [product, setProduct] = useState(null);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    getProduct(productId).then((data) => {
      setProduct(data);
      if (data?.category) {
        getProducts({ category: data.category }).then(setSuggestedProducts);
      }
      setLoading(false);
    });
  }, [productId]);

  return (
    <div>
      <Container className="px-4 md:px-12 bg-white rounded-lg my-4">
        <Box className="text-neutral-700 text-sm flex items-center mt-12">
          <Link
            to={`/${store}/menu`}
            className="flex items-center gap-2 hover:underline hover:text-pink-500"
          >
            <Home className="w-5 h-5" />
            Home Page
          </Link>

          <ChevronRight className="w-5 h-5 text-muted-foreground" />
          <Link
            to={`/${store}/menu`}
            className="flex items-center gap-2 text-muted-foreground hover:underline hover:text-pink-500"
          >
            Products
          </Link>
        </Box>

        <div className="py-10 space-y-10">
          {loading ? (
            <ProductDetailSkeleton />
          ) : product ? (
            <>
              <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
                <Gallery images={product.images} />

                <div className="mt-10 sm:mt-16 lg:mt-0">
                  <Info product={product} />
                </div>
              </div>

              <SuggestedList products={suggestedProducts} />
            </>
          ) : null}
        </div>
      </Container>
    </div>
  );
};

export default ProductPage;
