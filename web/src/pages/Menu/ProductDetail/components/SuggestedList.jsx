import { PopularContent } from "@/components/popular-content";
import { useParams } from "react-router-dom";

const SuggestedList = ({ products }) => {
  const { productId } = useParams();

  return (
    <>
      <h2 className="text-3xl text-neutral-600 font-semibold">
        Related Products
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-20 md:gap-x-4 md:gap-y-24">
        {products
          .filter((item) => item.id !== productId)
          .map((item) => (
            <PopularContent key={item.id} data={item} />
          ))}
      </div>
    </>
  );
};

export default SuggestedList;
