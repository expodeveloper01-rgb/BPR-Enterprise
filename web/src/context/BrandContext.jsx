import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const BrandContext = createContext();

const BRANDS = {
  belapari: {
    id: "belapari",
    name: "BeLaPaRi Ventures",
    logo: "/assets/img/belapari-icon.png",
    color: "from-pink-500 to-fuchsia-600",
  },
  "uncle-brew": {
    id: "uncle-brew",
    name: "Uncle Brew",
    logo: "/assets/img/uncle-brew.png",
    color: "from-pink-500 to-fuchsia-600",
  },
  diomedes: {
    id: "diomedes",
    name: "Diomedes Bakeshop",
    logo: "/assets/img/diomedes-logo.png",
    color: "from-amber-500 to-orange-600",
  },
};

export const BrandProvider = ({ children }) => {
  const { pathname } = useLocation();
  const [currentBrand, setCurrentBrand] = useState(BRANDS.belapari);

  useEffect(() => {
    // Determine current brand based on pathname
    if (pathname.startsWith("/uncle-brew")) {
      setCurrentBrand(BRANDS["uncle-brew"]);
      document.title = "Uncle Brew - Cebu Philippines";
    } else if (pathname.startsWith("/diomedes")) {
      setCurrentBrand(BRANDS.diomedes);
      document.title = "Diomedes Bakeshop - Cebu Philippines";
    } else {
      // Default to BeLaPaRi for all other routes (/, /stores, /sign-in, etc.)
      setCurrentBrand(BRANDS.belapari);
      document.title = "BeLaPaRi Ventures";
    }
  }, [pathname]);

  return (
    <BrandContext.Provider value={{ currentBrand, BRANDS }}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error("useBrand must be used within BrandProvider");
  }
  return context;
};
