import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const Contact = () => {
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
      // For now, just show a success message
      // In production, this would send to your backend
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-neutral-50 to-gray-100">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Get in{" "}
            <span className="bg-gradient-to-r from-pink-500 to-fuchsia-600 bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Have questions about BeLaPaRi or want to partner with us? We'd love
            to hear from you!
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Mail,
              title: "Email",
              content: "contact@belapari.com",
              description: "We typically respond within 24 hours",
            },
            {
              icon: Phone,
              title: "Phone",
              content: "+1 (555) 123-4567",
              description: "Monday to Friday, 9AM to 6PM",
            },
            {
              icon: MapPin,
              title: "Location",
              content: "San Francisco, CA",
              description: "Serving businesses nationwide",
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-br from-pink-100 to-fuchsia-100 rounded-full p-4">
                    <Icon className="w-8 h-8 text-fuchsia-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-lg font-semibold text-fuchsia-600 mb-1">
                  {item.content}
                </p>
                <p className="text-gray-600">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact Form */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Send us a Message
        </h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
        >
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-colors"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-colors"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-colors"
              placeholder="How can we help?"
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-colors resize-none"
              placeholder="Tell us more about your inquiry..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-fuchsia-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>

      {/* FAQ Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {[
            {
              q: "How do I become a partner with BeLaPaRi?",
              a: "We're always looking for exceptional food and beverage businesses to partner with. Contact us at partnerships@belapari.com with details about your business.",
            },
            {
              q: "What are the platform fees?",
              a: "Our commission structure is competitive and transparent. Reach out to discuss specific details tailored to your business.",
            },
            {
              q: "How can I track my orders?",
              a: "Once you've selected a store, you can track all your orders in the 'My Orders' section of your account.",
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept all major credit cards, debit cards, and digital payment methods for your convenience.",
            },
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3">{item.q}</h3>
              <p className="text-gray-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Contact;
