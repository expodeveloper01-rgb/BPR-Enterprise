import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Circle, Croissant, CreditCard, LogIn, Truck } from "lucide-react";
import AdPopup from "@/components/AdPopup";
import logo from "/assets/img/diomedes-logo.png";
import qr_code from "/assets/img/qr-code.png";
import ios_icon from "/assets/img/ios-icon.png";
import android_icon from "/assets/img/android-icon.png";

const HomepageContent = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-neutral-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,#fbbf24/20,transparent_60%)]" />
        <Container className="px-4 md:px-12 py-16 md:py-24 relative">
          <div className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16">
            <div className="flex flex-col gap-5 items-start flex-1">
              <span className="text-xs font-semibold tracking-widest uppercase text-amber-400">
                Artisanal Excellence
              </span>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Welcome to Diomedes Bakeshop
              </h1>
              <p className="text-neutral-300 text-base md:text-lg max-w-lg">
                Freshly baked artisanal bread, beautiful pastries, and
                delightful café experiences. Every bite tells a story of
                tradition and passion.
              </p>
              <div className="flex gap-4 w-full sm:w-auto pt-4">
                <Link to="/diomedes/menu" className="flex-1 sm:flex-none">
                  <Button className="w-full px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors">
                    Explore Menu
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex-1">
              <div className="w-full h-80 md:h-96 bg-gradient-to-br from-amber-200 to-orange-300 rounded-2xl flex items-center justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop"
                  alt="Fresh Artisan Bread"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 md:py-16">
        <Container className="px-4 md:px-12">
          <div className="space-y-8">
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center">
                Baked Fresh, Delivered Fast
              </h2>
              <p className="text-center text-neutral-600 max-w-2xl mx-auto">
                Our passion for quality baked goods and exceptional service
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {[
                ["100%", "Freshly Baked Daily"],
                ["25+", "Cake & Pastry Varieties"],
                ["50+", "Branches Across Regions"],
                ["10K+", "Happy Customers Daily"],
              ].map(([num, label], i) => (
                <div key={label} className="flex items-center gap-8">
                  {i > 0 && <hr className="h-14 w-[2px] bg-neutral-200" />}
                  <div>
                    <h2 className="text-3xl font-semibold text-amber-600">
                      {num}
                    </h2>
                    <p className="text-base text-neutral-600">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section className="bg-neutral-50 py-16 md:py-24">
        <Container className="px-4 md:px-12">
          <h2 className="text-4xl md:text-4xl font-bold tracking-wider flex flex-col items-center text-black my-4">
            Order Fresh pastries:{" "}
            <span className="text-neutral-500">A Quick Overview</span>
          </h2>
          <p className="w-full text-center md:w-[560px] text-base text-neutral-500 my-2 mx-auto">
            -- How It Works
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full my-12 mt-16">
            <div className="relative w-full min-h-[400px] bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center">
              <Croissant className="w-40 h-40 text-amber-600 opacity-20" />
            </div>

            <div className="relative flex flex-col gap-12 items-center md:min-h-[520px]">
              {[
                { Icon: LogIn, label: "Sign Up" },
                {
                  Icon: Circle,
                  label: "Browse Pastries",
                },
                { Icon: CreditCard, label: "Choose Payment" },
                { Icon: Truck, label: "Fresh Delivery" },
              ].map((item, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                    <item.Icon className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-neutral-800">
                      {item.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 md:py-20">
        <Container className="px-4 md:px-12">
          <div className="space-y-12">
            <h2 className="text-4xl font-bold text-center text-neutral-900">
              Why Choose Diomedes?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Artisan Quality",
                  description:
                    "Handcrafted pastries made with the finest ingredients and traditional techniques",
                  icon: "🥐",
                },
                {
                  title: "Fast Delivery",
                  description:
                    "Same-day delivery for your freshly baked favorites. Your pastries arrive warm!",
                  icon: "🚚",
                },
                {
                  title: "Custom Orders",
                  description:
                    "Plan your events perfectly with our custom cake and pastry customization service",
                  icon: "🎂",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center gap-2 py-6 px-8 border-none shadow-lg rounded-3xl sm:col-span-1 bg-white"
                >
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h2 className="text-2xl font-semibold">{feature.title}</h2>
                  <p className="text-base text-neutral-500 text-center">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-500 py-16 md:py-20">
        <Container className="px-4 md:px-12">
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to Indulge?
            </h2>
            <p className="text-lg text-amber-50 max-w-2xl mx-auto">
              Browse our complete selection of fresh pastries, cakes, and baked
              goods
            </p>
            <Link to="/diomedes/menu">
              <Button className="px-8 py-3 bg-white text-amber-600 hover:bg-amber-50 font-semibold rounded-lg">
                Start Ordering
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* App Download */}
      <section className="bg-white py-16 md:py-20">
        <Container className="px-4 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-neutral-900">
                Download Our App
              </h2>
              <p className="text-neutral-600 text-lg">
                Order on the go and get exclusive app-only deals on your
                favorite pastries
              </p>
              <div className="flex gap-4">
                <img
                  src={ios_icon}
                  alt="iOS"
                  className="h-12 w-auto cursor-pointer hover:opacity-80"
                />
                <img
                  src={android_icon}
                  alt="Android"
                  className="h-12 w-auto cursor-pointer hover:opacity-80"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src={qr_code}
                alt="QR Code"
                className="w-48 h-48 border-4 border-amber-100 p-4 rounded-lg"
              />
            </div>
          </div>
        </Container>
      </section>

      <AdPopup />
    </div>
  );
};

export default HomepageContent;
