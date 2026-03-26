import { useEffect, useState } from "react";
import getProducts from "@/actions/get-products";
import getKitchens from "@/actions/get-kitchens";
import HomepageContent from "./HomepageContent";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);

  useEffect(() => {
    getKitchens().then((kitchens) => {
      const uncleBrew = kitchens.find((k) => k.name === "Uncle Brew");
      const kitchenId = uncleBrew?.id;

      if (kitchenId) {
        getProducts({ isFeatured: true, kitchen: kitchenId }).then(setProducts);
        getProducts({ isFeatured: true, kitchen: kitchenId }).then(
          setNewProducts,
        );
      }
    });
  }, []);

  return (
    <div>
      <HomepageContent products={products} newProducts={newProducts} />
    </div>
  );
};

export default HomePage;
