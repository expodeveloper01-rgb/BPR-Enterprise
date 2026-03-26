import { Mail, Phone, MapPin, Send, Coffee, Clock } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const UncleBrewContact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      toast.success("Message sent! We'll brew up a response soon ☕");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-12 py-16 text-center">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-black leading-tight uppercase tracking-wider">
            Contact Uncle Brew
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Have questions about our premium coffee, pastries, or sandwiches?
            We'd love to hear from you. Reach out anytime!
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="max-w-7xl mx-auto px-4 md:px-12 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Mail,
              title: "Email",
              content: "hello@unclebrew.com",
              description: "We respond within 24 hours",
            },
            {
              icon: Phone,
              title: "Phone",
              content: "+1 (415) 555-BREW",
              description: "Monday to Sunday, 7AM to 10PM",
            },
            {
              icon: MapPin,
              title: "Location",
              content: "San Francisco, CA",
              description: "Visit our flagship store",
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-neutral-50 border border-neutral-300 rounded-xl p-8 hover:border-neutral-400 transition-all text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-neutral-100 rounded-full p-4">
                    <Icon className="w-8 h-8 text-black" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">
                  {item.title}
                </h3>
                <p className="text-lg font-semibold text-black mb-1">
                  {item.content}
                </p>
                <p className="text-neutral-600">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact Form */}
      <section className="max-w-4xl mx-auto px-4 md:px-12 py-16">
        <h2 className="text-3xl font-bold text-black mb-12 text-center">
          Send us a Message
        </h2>
        <form
          onSubmit={handleSubmit}
          className="bg-neutral-50 border border-neutral-300 rounded-2xl p-8 md:p-12"
        >
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-800 transition-colors"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-800 transition-colors"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-black mb-2">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-800 transition-colors"
              placeholder="What's on your mind?"
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-black mb-2">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="6"
              className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-800 transition-colors resize-none"
              placeholder="Tell us more..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-neutral-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>

      {/* Hours & Info Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-12 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-neutral-50 border border-neutral-300 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-black" />
              <h3 className="text-2xl font-bold text-black">Operating Hours</h3>
            </div>
            <div className="space-y-3 text-neutral-700">
              <p className="flex justify-between">
                <span>Monday - Friday:</span>
                <span className="text-black font-semibold">
                  7:00 AM - 8:00 PM
                </span>
              </p>
              <p className="flex justify-between">
                <span>Saturday - Sunday:</span>
                <span className="text-black font-semibold">
                  8:00 AM - 10:00 PM
                </span>
              </p>
              <p className="text-sm mt-6 text-neutral-600">
                ☕ Closed on major holidays. Check our Instagram for updates!
              </p>
            </div>
          </div>

          <div className="bg-neutral-50 border border-neutral-300 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Coffee className="w-6 h-6 text-black" />
              <h3 className="text-2xl font-bold text-black">Why Uncle Brew?</h3>
            </div>
            <ul className="space-y-3 text-neutral-700">
              <li className="flex items-start gap-3">
                <span className="text-black font-bold mt-1">✓</span>
                <span>Ethically sourced, premium coffee beans</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-black font-bold mt-1">✓</span>
                <span>Freshly baked pastries daily</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-black font-bold mt-1">✓</span>
                <span>Gourmet sandwiches crafted to order</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-black font-bold mt-1">✓</span>
                <span>Warm, welcoming community space</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UncleBrewContact;
