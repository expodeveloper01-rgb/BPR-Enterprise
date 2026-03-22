import { useState, useEffect } from "react";
import useAuth from "@/hooks/use-auth";
import getOrders from "@/actions/get-orders";
import Container from "@/components/container";
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import PageContent from "./components/PageContent";

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="px-4 md:px-12 py-10">
        <div>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
            <Link to="/" className="flex items-center gap-1 hover:text-neutral-800 transition-colors">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-neutral-800 font-medium">My Orders</span>
          </nav>

          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-6">My Orders</h1>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-white rounded-2xl border border-gray-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <PageContent orders={orders} />
          )}
        </div>
      </Container>
    </div>
  );
};

export default OrdersPage;
