import { useState, useEffect } from "react";
import useAuth from "@/hooks/use-auth";
import getOrders from "@/actions/get-orders";
import Container from "@/components/container";
import { ChevronRight } from "lucide-react";
import { Link, Navigate, useLocation } from "react-router-dom";
import PageContent from "./components/PageContent";
import CustomerOrderDetail from "./components/CustomerOrderDetail";

const OrdersPage = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const isUncleBrew = pathname.startsWith("/uncle-brew");
  const brandName = isUncleBrew ? "Uncle Brew" : "BeLaPaRi";
  const brandHome = isUncleBrew ? "/uncle-brew" : "/";

  // Redirect to sign in if not authenticated
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  useEffect(() => {
    const fetchOrders = () => {
      getOrders()
        .then(setOrders)
        .catch(console.error)
        .finally(() => setLoading(false));
    };

    fetchOrders();

    // Refetch every 6 seconds to show real-time status updates
    const interval = setInterval(fetchOrders, 6000);

    // Refetch when page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchOrders();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user]);

  return (
    <div className="min-h-screen bg-white">
      <Container className="px-4 md:px-12 py-10">
        <div>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
            <Link
              to={brandHome}
              className="flex items-center gap-1 hover:text-neutral-800 transition-colors font-medium"
            >
              {brandName}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-neutral-800 font-medium">My Orders</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
            My Orders
          </h1>
          <p className="text-neutral-600 mb-8">
            Track and manage all your orders in one place
          </p>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-24 bg-gray-100 rounded-2xl border border-gray-200 animate-pulse"
                />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-600 text-lg">No orders yet</p>
              <p className="text-neutral-500 text-sm mt-2">
                Start shopping to place your first order
              </p>
              <Link
                to={brandHome}
                className="inline-block mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <PageContent orders={orders} onViewDetail={setSelectedOrder} />
          )}
        </div>
      </Container>

      {selectedOrder && (
        <CustomerOrderDetail
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default OrdersPage;
