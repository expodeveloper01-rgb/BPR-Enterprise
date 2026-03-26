import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const DiomedesAbout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-neutral-50 to-amber-50 pt-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            About{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              Diomedes Bakeshop
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Crafting artisanal baked goods with passion, tradition, and the
            finest ingredients for over decades. Every pastry tells a story.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">Our Story</h2>
              <p className="text-gray-600 leading-relaxed">
                Diomedes Bakeshop was founded on the principle that every
                customer deserves access to authentic, freshly-baked pastries
                made with love. What started as a small neighborhood bakery has
                grown into a beloved institution known for exceptional quality
                and service.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our master bakers follow traditional recipes handed down through
                generations, while also innovating with new flavors and
                techniques.
              </p>
            </div>
            <div className="w-full h-64 md:h-80 bg-gradient-to-br from-amber-200 to-orange-300 rounded-xl flex items-center justify-center">
              <div className="text-6xl">🥐</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
          Our Core Values
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Quality",
              description:
                "We use only premium ingredients sourced from trusted suppliers to ensure every pastry is exceptional.",
              icon: "✨",
            },
            {
              title: "Tradition",
              description:
                "Our recipes honor time-tested baking methods combined with modern innovation for perfect results.",
              icon: "📚",
            },
            {
              title: "Community",
              description:
                "We believe in supporting local communities through sustainable practices and fair partnerships.",
              icon: "🤝",
            },
          ].map((value, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-5xl mb-4">{value.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Experience Authentic Baking
          </h2>
          <p className="text-amber-50 mb-8 max-w-2xl mx-auto">
            Visit our stores or order online to discover the Diomedes difference
            in every bite.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/diomedes/menu"
              className="inline-block px-8 py-3 bg-white text-amber-600 font-semibold rounded-lg hover:bg-amber-50 transition-colors"
            >
              Order Now
            </Link>
            <Link
              to="/diomedes/contact"
              className="inline-block px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <section className="max-w-7xl mx-auto px-6 py-8 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link to="/diomedes" className="hover:text-amber-600">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">About</span>
        </div>
      </section>
    </div>
  );
};

export default DiomedesAbout;
