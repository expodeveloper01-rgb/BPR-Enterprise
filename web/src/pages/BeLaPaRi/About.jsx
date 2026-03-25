import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-neutral-50 to-gray-100 pt-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            About{" "}
            <span className="bg-gradient-to-r from-pink-500 to-fuchsia-600 bg-clip-text text-transparent">
              BeLaPaRi
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We are a platform dedicated to connecting exceptional food and
            beverage experiences with passionate customers who appreciate
            quality and innovation.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                BeLaPaRi Ventures is committed to curating and showcasing the
                finest culinary platforms and experiences. We believe that great
                food and beverage businesses deserve a platform to thrive and
                connect with their ideal audience.
              </p>
              <p>
                From artisanal coffee roasters to fine dining establishments, we
                partner with businesses that share our passion for excellence
                and innovation in the food and beverage industry.
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-pink-100 to-fuchsia-100 rounded-2xl p-8 h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-xl font-semibold text-gray-900">
                Quality First
              </p>
              <p className="text-gray-600 mt-2">
                Excellence in every experience
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          Our Values
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Quality",
              description:
                "We only partner with businesses that maintain the highest standards of quality in their offerings.",
              icon: "✨",
            },
            {
              title: "Innovation",
              description:
                "We celebrate culinary creativity and support businesses pushing the boundaries of food and beverage.",
              icon: "💡",
            },
            {
              title: "Community",
              description:
                "We foster connections between passionate businesses and customers who appreciate excellence.",
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
        <div className="bg-gradient-to-r from-pink-500 to-fuchsia-600 rounded-2xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Explore?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Browse our curated collection of exceptional food and beverage
            platforms.
          </p>
          <Link
            to="/browse-stores"
            className="inline-flex items-center gap-2 bg-white text-fuchsia-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Browse Stores <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
