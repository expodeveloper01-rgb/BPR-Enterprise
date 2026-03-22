import Box from "@/components/box";
import { cn } from "@/lib/utils";
import { CheckSquare } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import qs from "query-string";

const CategoryFilters = ({ categories }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleClick = (category) => {
    const currentParams = Object.fromEntries(searchParams.entries());

    if (currentParams.category === category) {
      delete currentParams.category;
    } else {
      currentParams.category = category;
    }

    const href = qs.stringifyUrl({
      url: "/menu",
      query: currentParams,
    });

    navigate(href);
  };

  return (
    <Box className="flex-col gap-2 border-b pb-4 cursor-pointer">
      <h2 className="text-xl font-semibold text-neutral-700">Category</h2>
      <Box className="flex-col gap-2 mt-2">
        {categories?.map((category) => (
          <div
            onClick={() => handleClick(category.name)}
            key={category.id}
            className={cn(
              "test-sm font-semibold text-neutral-500 flex items-center my-2",
              category.name === searchParams.get("category") && "text-hero",
            )}
          >
            <p>{category.name}</p>
            {category.name === searchParams.get("category") && (
              <CheckSquare className="ml-2 w-4 h-4 text-hero" />
            )}
          </div>
        ))}
      </Box>
    </Box>
  );
};

export default CategoryFilters;
