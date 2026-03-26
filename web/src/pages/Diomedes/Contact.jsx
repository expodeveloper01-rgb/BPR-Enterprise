import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const DiomedesContact = () => {
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
      toast.success("Message sent! We'll knead to get back to you soon 🥐");
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
            Contact Diomedes Bakeshop
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Do you have questions about our fresh pastries, custom cakes, or
            delivery services? We&apos;d love to hear from you. Reach out
            anytime!
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="max-w-7xl mx-auto px-4 md:px-12 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: <Phone className="w-8 h-8 text-amber-600" />,
              title: "Call Us",
              info: "(123) 456-7890",
              subtext: "Available 7 AM - 7 PM",
            },
            {
              icon: <Mail className="w-8 h-8 text-amber-600" />,
              title: "Email Us",
              info: "hello@diomedes.ph",
              subtext: "We reply within 24 hours",
            },
            {
              icon: <MapPin className="w-8 h-8 text-amber-600" />,
              title: "Visit Us",
              info: "Diomedes Main Store",
              subtext: "123 Baker Street, Cebu City",
            },
          ].map((contact, idx) => (
            <div
              key={idx}
              className="bg-amber-50 rounded-2xl p-8 flex flex-col items-center text-center space-y-4 border-2 border-amber-100 hover:shadow-lg transition-shadow"
            >
              <div className="p-4 bg-white rounded-full">{contact.icon}</div>
              <h3 className="text-xl font-semibold text-black">
                {contact.title}
              </h3>
              <p className="text-lg font-medium text-neutral-800">
                {contact.info}
              </p>
              <p className="text-sm text-neutral-600">{contact.subtext}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="max-w-4xl mx-auto px-4 md:px-12 py-12">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 md:p-12 border-2 border-amber-100">
          <h2 className="text-3xl font-bold text-black mb-2">
            Send us a Message
          </h2>
          <p className="text-neutral-600 mb-8">
            Fill out the form below and we&apos;ll get back to you as soon as
            possible.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-800 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500 bg-white transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-800 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500 bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-800 mb-2">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder="How we can help you"
                className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500 bg-white transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-800 mb-2">
                Message *
              </label>
              <textarea
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message here..."
                rows="6"
                className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500 bg-white transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="!flex" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Hours Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-12 py-16 text-center">
        <div className="bg-white rounded-2xl border-2 border-amber-100 p-8 md:p-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Clock className="w-8 h-8 text-amber-600" />
            <h2 className="text-3xl font-bold text-black">Bakery Hours</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div>
              <p className="font-semibold text-neutral-800 mb-3">Weekdays</p>
              <p className="text-lg text-neutral-600">7:00 AM - 8:00 PM</p>
            </div>
            <div>
              <p className="font-semibold text-neutral-800 mb-3">
                Weekends & Holidays
              </p>
              <p className="text-lg text-neutral-600">7:00 AM - 9:00 PM</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DiomedesContact;
