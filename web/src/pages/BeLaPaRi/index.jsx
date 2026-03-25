import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useAuth from "@/hooks/use-auth";
import uncleLogo from "/assets/img/uncle-brew.png";
import { ChevronRight } from "lucide-react";

const BeLaPaRiHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/stores");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-neutral-50 to-gray-100 pt-16">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
            Welcome to <br />
            <span className="bg-gradient-to-r from-pink-500 to-fuchsia-600 bg-clip-text text-transparent">
              BeLaPaRi Ventures
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover a world of premium food and beverage experiences. From
            artisanal coffee to gourmet cuisine, we bring you the finest
            platforms crafted with passion.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link
              to="/sign-in"
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white hover:from-pink-600 hover:to-fuchsia-700 transition-colors rounded-lg font-semibold flex items-center gap-2 w-fit mx-auto"
            >
              Get Started <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Store */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-300 hover:border-pink-500 transition-colors shadow-lg">
          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
            {/* Store Info */}
            <div className="flex flex-col justify-center space-y-6">
              <div className="flex items-center gap-4">
                <img src={uncleLogo} alt="Uncle Brew" className="h-16" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Uncle Brew
                  </h3>
                  <p className="text-gray-600 text-sm">Coffee & Bites</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Experience artisanal coffee, freshly baked pastries, and
                delectable sandwiches. Uncle Brew is your go-to destination for
                quality coffee and premium food offerings.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-pink-500" />
                  <span>Premium Specialty Coffee</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-pink-500" />
                  <span>Fresh Pastries & Baked Goods</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-pink-500" />
                  <span>Gourmet Sandwiches</span>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="flex items-center justify-center">
              <img
                src={uncleLogo}
                alt="Uncle Brew"
                className="w-64 h-64 object-contain opacity-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Stores */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          More Platforms Coming Soon
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-8 border border-gray-300 text-center space-y-4 hover:border-pink-500 transition-colors shadow-md"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
                <span className="text-2xl text-gray-400">?</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Platform Coming Soon
              </h3>
              <p className="text-sm text-gray-600">
                We're expanding our ventures. More exciting platforms will be
                available soon.
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BeLaPaRiHome;
