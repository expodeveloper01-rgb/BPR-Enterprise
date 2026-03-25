import Container from "@/components/container";
import {
  Facebook,
  Instagram,
  Youtube,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "/assets/img/belapari-icon.png";

const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-gradient-to-br from-gray-50 via-white to-gray-100 border-t border-gray-300">
      {/* Gradient top border */}
      <div className="h-px bg-gradient-to-r from-pink-500 via-fuchsia-500 to-pink-500" />

      <Container>
        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-14 px-4 md:px-12">
          {/* Brand */}
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
            <img src={logo} alt="BeLaPaRi Ventures" className="w-16 h-16" />
            <p className="text-sm text-gray-600 leading-relaxed">
              Discover premium food and beverage experiences across multiple
              platforms. From artisanal coffee to gourmet cuisine, we bring you
              the finest curated ventures.
            </p>
            <div className="flex items-center gap-3 mt-1">
              {[
                { Icon: Facebook, href: "#" },
                { Icon: Instagram, href: "#" },
                { Icon: Youtube, href: "#" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-full bg-pink-500/10 hover:bg-pink-500/20 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4 text-pink-500" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Home", to: "/" },
                { label: "Stores", to: "/stores" },
                { label: "About", to: "/about" },
                { label: "My Orders", to: "/orders" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm text-gray-600 hover:text-pink-600 transition-colors hover:pl-1 duration-200 inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-pink-500 mt-[2px] shrink-0" />
                <span className="text-sm text-gray-600">+63 900 000 0000</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-pink-500 mt-[2px] shrink-0" />
                <span className="text-sm text-gray-600">info@belapari.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-pink-500 mt-[2px] shrink-0" />
                <span className="text-sm text-gray-600">
                  Cebu City, Philippines
                </span>
              </li>
            </ul>
          </div>

          {/* Subscribe */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">
              Newsletter
            </h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Get the latest updates from our platforms.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-2"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <Button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white hover:from-pink-600 hover:to-fuchsia-700 font-semibold text-sm transition-all"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-300 py-5 px-4 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} BeLaPaRi Ventures. All Rights
            Reserved.
          </p>
          <p className="text-xs text-gray-600">
            Crafted by{" "}
            <a
              href="https://beliarommel.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="text-pink-600 hover:text-fuchsia-700 transition-colors"
            >
              Rommel Belia
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
