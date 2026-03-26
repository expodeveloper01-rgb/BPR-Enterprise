import { Link, useLocation } from "react-router-dom";

const BRANDS = {
  belapari: {
    id: "belapari",
    name: "BeLaPaRi Ventures",
    logo: "/assets/img/belapari-icon.png",
  },
  "uncle-brew": {
    id: "uncle-brew",
    name: "Uncle Brew",
    logo: "/assets/img/uncle-brew.png",
  },
  diomedes: {
    id: "diomedes",
    name: "Diomedes Bakeshop",
    logo: "/assets/img/diomedes-logo.png",
  },
};

const AuthHeader = () => {
  const { pathname } = useLocation();

  // Determine brand directly from pathname
  const currentBrand = pathname.startsWith("/uncle-brew")
    ? BRANDS["uncle-brew"]
    : pathname.startsWith("/diomedes")
      ? BRANDS["diomedes"]
      : BRANDS.belapari;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-300 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center shrink-0">
          <img
            src={currentBrand.logo}
            alt={currentBrand.name}
            className="h-14 w-14"
          />
        </Link>
        <div className="text-sm text-gray-600">
          <span className="bg-gradient-to-r from-pink-500 to-fuchsia-600 bg-clip-text text-transparent font-semibold">
            {currentBrand.name}
          </span>
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;
