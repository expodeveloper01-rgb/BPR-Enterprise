import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useAuth from "@/hooks/use-auth";
import { useStore } from "@/context/StoreContext";
import OrdersCard from "@/components/OrdersCard";
import uncleLogo from "/assets/img/uncle-brew.png";
import diomedesLogo from "/assets/img/diomedes-logo.png";
import { ArrowRight } from "lucide-react";

const stores = [
  {
    id: "uncle-brew",
    name: "Uncle Brew",
    description: "Premium Coffee & Gourmet Bites",
    logo: uncleLogo,
    category: "Coffee & Food",
    status: "active",
    features: ["Specialty Coffee", "Fresh Pastries", "Gourmet Sandwiches"],
  },
  {
    id: "diomedes",
    name: "Diomedes Bakeshop",
    description: "Artisanal Bakery & Café",
    logo: diomedesLogo,
    category: "Bakery",
    status: "active",
    features: ["Sourdough Bread", "Fresh Pastries", "Premium Coffee"],
  },
  {
    id: "coming-soon-2",
    name: "Coming Soon",
    description: "New venture launching soon",
    logo: null,
    category: "TBA",
    status: "coming-soon",
    features: [],
  },
];

const StoresDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { selectStore } = useStore();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSelectStore = (store) => {
    if (store.status === "active") {
      selectStore(store);
      // Navigate to the store platform
      navigate(`/${store.id}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-neutral-50 to-gray-100">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-12">
          {/* Active Orders Card - at the very top */}
          <OrdersCard />

          {/* Welcome Section */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Welcome,{" "}
              <span className="bg-gradient-to-r from-pink-500 to-fuchsia-600 bg-clip-text text-transparent">
                {user?.name}
              </span>
            </h1>
            <p className="text-lg text-gray-600">
              Choose a platform to get started with your order
            </p>
          </div>

          {/* Stores Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <div
                key={store.id}
                className={`rounded-2xl border overflow-hidden transition-all ${
                  store.status === "active"
                    ? "border-pink-500 bg-white shadow-lg hover:shadow-xl hover:shadow-pink-500/20 cursor-pointer"
                    : "border-gray-300 bg-gray-50 opacity-60"
                }`}
                onClick={() => handleSelectStore(store)}
              >
                {/* Header */}
                <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
                  {store.logo ? (
                    <img
                      src={store.logo}
                      alt={store.name}
                      className="h-30 object-contain"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-300 rounded-xl flex items-center justify-center text-2xl text-gray-500">
                      ?
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {store.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {store.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {store.category}
                    </p>
                    {store.features.length > 0 && (
                      <ul className="text-sm text-gray-700 space-y-1">
                        {store.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSelectStore(store)}
                    disabled={store.status !== "active"}
                    className={`w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                      store.status === "active"
                        ? "bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white hover:from-pink-600 hover:to-fuchsia-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {store.status === "active" ? (
                      <>
                        Shop Now <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      "Coming Soon"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Info Section */}
          <div className="bg-white border border-gray-300 rounded-xl p-8 space-y-4 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900">
              About BeLaPaRi Ventures
            </h3>
            <p className="text-gray-700 leading-relaxed">
              BeLaPaRi Ventures is owned by{" "}
              <span className="font-bold">Belia, Laniton, Pancho & Rivas</span>{" "}
              Group where you can found the collection of premium food and
              beverage platforms, each crafted to deliver exceptional
              experiences. From specialty coffee to gourmet cuisine, we're
              committed to bringing you the finest quality in everything we do.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoresDashboard;
