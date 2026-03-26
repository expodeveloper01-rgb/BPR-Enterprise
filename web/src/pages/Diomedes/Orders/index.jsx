import { useState, useEffect } from "react";
import useAuth from "@/hooks/use-auth";
import getOrders from "@/actions/get-orders";
import Container from "@/components/container";
import { ChevronRight, Home, PackageOpen, Croissant } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import PageContent from "@/pages/Orders/components/PageContent";
import { Button } from "@/components/ui/button";

const DiomedesOrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [user]);

  // Redirect to sign in if not authenticated
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50">
      <Container className="px-4 md:px-12 py-10 pt-12">
        {/* Header Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-8 md:p-12 border-2 border-amber-200">
            <div className="flex items-center gap-4 mb-4">
              <Croissant className="w-8 h-8 text-amber-700" />
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 uppercase tracking-wide">
                Your Order History
              </h1>
            </div>
            <p className="text-lg text-neutral-700">
              Track your freshly baked orders and their delivery status
            </p>
          </div>
        </div>

        <div className="mb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-neutral-600 mb-6">
            <Link
              to="/diomedes"
              className="flex items-center gap-1 hover:text-amber-600 transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-neutral-800 font-medium">Your Orders</span>
          </nav>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-white rounded-2xl border-2 border-amber-100 animate-pulse"
              />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-6">
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
              <PackageOpen className="w-10 h-10 text-amber-600" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-neutral-900 mb-2">
                No orders yet
              </p>
              <p className="text-lg text-neutral-600 mb-6">
                Start your order journey at Diomedes Bakeshop today!
              </p>
              <Link to="/diomedes/menu">
                <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-8 py-3 rounded-full">
                  🥐 Browse Our Shop
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <PageContent orders={orders} />
          </div>
        )}
      </Container>
    </div>
  );
};

export default DiomedesOrdersPage;
