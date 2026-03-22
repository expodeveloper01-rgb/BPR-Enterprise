import { useEffect, useState } from "react";
import getProducts from "@/actions/get-products";
import HomepageContent from "./HomepageContent";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);

  useEffect(() => {
    getProducts({ isFeatured: true }).then(setProducts);
    getProducts({ isFeatured: true }).then(setNewProducts);
  }, []);

  return (
    <div>
      <HomepageContent products={products} newProducts={newProducts} />
    </div>
  );
};

export default HomePage;
