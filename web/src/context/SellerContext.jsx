import { createContext, useContext, useState, useEffect } from "react";
import getKitchens from "@/actions/get-kitchens";

const SellerContext = createContext();

export const SellerProvider = ({ children }) => {
  const [kitchens, setKitchens] = useState([]);
  const [selectedKitchenId, setSelectedKitchenId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getKitchens()
      .then((data) => {
        console.log("🏪 Kitchens loaded:", data);
        setKitchens(data);
        // Default to first kitchen if none selected
        const saved = localStorage.getItem("seller-kitchen-id");
        console.log("📍 Saved kitchen ID from localStorage:", saved);
        if (saved && data.some((k) => k.id === saved)) {
          console.log("✅ Using saved kitchen:", saved);
          setSelectedKitchenId(saved);
        } else if (data.length > 0) {
          console.log("✅ Using first kitchen:", data[0].id);
          setSelectedKitchenId(data[0].id);
        }
      })
      .catch((err) => {
        console.error("❌ Failed to load kitchens:", err);
        setKitchens([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const setKitchen = (kitchenId) => {
    setSelectedKitchenId(kitchenId);
    localStorage.setItem("seller-kitchen-id", kitchenId);
  };

  const selectedKitchen = kitchens.find((k) => k.id === selectedKitchenId);

  return (
    <SellerContext.Provider
      value={{
        kitchens,
        selectedKitchenId,
        selectedKitchen,
        setKitchen,
        loading,
      }}
    >
      {children}
    </SellerContext.Provider>
  );
};

export const useSeller = () => {
  const context = useContext(SellerContext);
  if (!context) {
    throw new Error("useSeller must be used within SellerProvider");
  }
  return context;
};
