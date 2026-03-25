import { useNavigate } from "react-router-dom";
import { MapPin, ChevronRight } from "lucide-react";
import useAuth from "@/hooks/use-auth";

const stores = [
  {
    id: "uncle-brew",
    name: "Uncle Brew",
    description: "Premium Coffee & Gourmet Bites",
    category: "Coffee & Food",
    location: "Cebu City, Philippines",
    image: "/assets/img/uncle-brew.png",
    features: ["Specialty Coffee", "Fresh Pastries", "Gourmet Sandwiches"],
    status: "active",
  },
  {
    id: "coming-soon-1",
    name: "Diomedes Bakeshop",
    description: "Artisanal Bakery & Café",
    category: "Bakery",
    location: "Coming Soon",
    image: null,
    features: ["Sourdough Bread", "Pastries", "Premium Coffee"],
    status: "coming-soon",
  },
  {
    id: "coming-soon-2",
    name: "Annalyn's Eatery",
    description: "Organic Farm-to-Table Restaurant",
    category: "Restaurant",
    location: "Coming Soon",
    image: null,
    features: ["Organic Ingredients", "Seasonal Menu", "Local Sourcing"],
    status: "coming-soon",
  },
];

const BrowseStores = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStoreClick = (store) => {
    if (store.status === "coming-soon") {
      return;
    }
    if (!user) {
      navigate("/sign-in");
      return;
    }
    navigate(`/${store.id}`);
  };

  const activeStores = stores.filter((s) => s.status === "active");
  const comingSoonStores = stores.filter((s) => s.status === "coming-soon");

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-neutral-50 to-gray-100 pt-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Browse Our{" "}
            <span className="bg-gradient-to-r from-pink-500 to-fuchsia-600 bg-clip-text text-transparent">
              Stores
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover exceptional food and beverage experiences curated by
            BeLaPaRi Ventures.
          </p>
        </div>
      </section>

      {/* Active Stores */}
      {activeStores.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Available Now
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeStores.map((store) => (
              <div
                key={store.id}
                onClick={() => handleStoreClick(store)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer group"
              >
                {/* Store Image */}
                <div className="h-48 bg-gradient-to-br from-pink-100 to-fuchsia-100 flex items-center justify-center overflow-hidden">
                  {store.image ? (
                    <img
                      src={store.image}
                      alt={store.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-6xl">🏪</div>
                  )}
                </div>

                {/* Store Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {store.name}
                      </h3>
                      <p className="text-sm font-semibold text-pink-500 mt-1">
                        {store.category}
                      </p>
                    </div>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      Active
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">
                    {store.description}
                  </p>

                  <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
                    <MapPin className="w-4 h-4" />
                    {store.location}
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {store.features.map((feature) => (
                      <span
                        key={feature}
                        className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <button className="w-full bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white py-2 rounded-lg font-semibold hover:from-pink-600 hover:to-fuchsia-700 transition-all flex items-center justify-center gap-2 group-hover:gap-3">
                    {user ? "Visit Store" : "Sign In to Order"}
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Coming Soon Stores */}
      {comingSoonStores.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Coming Soon</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {comingSoonStores.map((store) => (
              <div
                key={store.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden opacity-60"
              >
                {/* Store Image */}
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <div className="text-6xl">🎉</div>
                </div>

                {/* Store Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {store.name}
                      </h3>
                      <p className="text-sm font-semibold text-gray-500 mt-1">
                        {store.category}
                      </p>
                    </div>
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                      Coming Soon
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">
                    {store.description}
                  </p>

                  <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
                    <MapPin className="w-4 h-4" />
                    {store.location}
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {store.features.map((feature) => (
                      <span
                        key={feature}
                        className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg font-semibold cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Info Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-pink-500 to-fuchsia-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-lg opacity-90 mb-8">
            Sign in to place your first order from any of our partner stores.
          </p>
          {!user && (
            <button
              onClick={() => navigate("/sign-in")}
              className="bg-white text-fuchsia-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Sign In Now
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default BrowseStores;
