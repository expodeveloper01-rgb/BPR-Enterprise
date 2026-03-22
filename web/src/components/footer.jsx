import Container from "@/components/container";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "/assets/img/uncle-brew.png";

const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-neutral-900">
      {/* Gradient top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <Container>
        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-14 px-4 md:px-12">
          {/* Brand */}
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
            <img src={logo} alt="logo" className="w-28" />
            <p className="text-sm text-neutral-400 leading-relaxed">
              Join us on a flavorful journey where every bite brings joy. Stay
              updated with our latest delights!
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
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Home", to: "/" },
                { label: "Menu", to: "/menu" },
                { label: "About", to: "/about" },
                { label: "My Orders", to: "/orders" },
                { label: "Cart", to: "/cart" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm text-neutral-400 hover:text-white transition-colors hover:pl-1 duration-200 inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-neutral-400 mt-[2px] shrink-0" />
                <span className="text-sm text-neutral-400">+63 900 000 0000</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-neutral-400 mt-[2px] shrink-0" />
                <span className="text-sm text-neutral-400">info@unclebrew.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-neutral-400 mt-[2px] shrink-0" />
                <span className="text-sm text-neutral-400">
                  ABC Street, Cebu City, Philippines
                </span>
              </li>
            </ul>
          </div>

          {/* Subscribe */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              Newsletter
            </h3>
            <p className="text-sm text-neutral-400 mb-4 leading-relaxed">
              Get the latest deals and updates straight to your inbox.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              <Button
                type="submit"
                className="w-full rounded-lg bg-white text-black hover:bg-neutral-200 font-semibold text-sm"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-5 px-4 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} Uncle Brew PH. All Rights Reserved.
          </p>
          <p className="text-xs text-neutral-500">
            Crafted by{" "}
            <a
              href="https://beliarommel.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-300 hover:text-white transition-colors"
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
