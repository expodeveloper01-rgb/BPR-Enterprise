import Box from "@/components/box";
import { cn } from "@/lib/utils";
import { CheckSquare } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import qs from "query-string";

const SizeFilters = ({ sizes }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleClick = (size) => {
    const currentParams = Object.fromEntries(searchParams.entries());

    if (currentParams.size === size) {
      delete currentParams.size;
    } else {
      currentParams.size = size;
    }

    const href = qs.stringifyUrl({
      url: "/menu",
      query: currentParams,
    });

    navigate(href);
  };

  return (
    <Box className="flex-col gap-2 border-b pb-4 cursor-pointer">
      <h2 className="text-xl font-semibold text-neutral-700 mt-2">Size</h2>
      <Box className="flex-col gap-2 mt-2">
        {sizes?.map((size) => (
          <div
            onClick={() => handleClick(size.name)}
            key={size.id}
            className={cn(
              "test-sm font-semibold text-neutral-500 flex items-center my-2",
              size.name === searchParams.get("size") && "text-hero",
            )}
          >
            <p>
              {size.name} ({size.value})
            </p>
            {size.name === searchParams.get("size") && (
              <CheckSquare className="ml-2 w-4 h-4 text-hero" />
            )}
          </div>
        ))}
      </Box>
    </Box>
  );
};

export default SizeFilters;
