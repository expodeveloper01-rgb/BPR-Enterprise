import Container from "@/components/container";
import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import CartContent from "./components/CartContent";

const CartPage = () => {
  const { pathname } = useLocation();
  const isUncleBrew = pathname.startsWith("/uncle-brew");
  const isDiomedes = pathname.startsWith("/diomedes");
  const store = isUncleBrew
    ? "uncle-brew"
    : isDiomedes
      ? "diomedes"
      : "uncle-brew";

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="px-4 md:px-12 py-10">
        <div>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
            <Link
              to={`/${store}`}
              className="flex items-center gap-1 hover:text-neutral-800 transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              to={`/${store}/menu`}
              className="hover:text-neutral-800 transition-colors"
            >
              Menu
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-neutral-800 font-medium">Cart</span>
          </nav>

          <CartContent store={store} />
        </div>
      </Container>
    </div>
  );
};

export default CartPage;
