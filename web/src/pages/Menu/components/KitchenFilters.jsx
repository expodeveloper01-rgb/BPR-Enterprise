import Box from "@/components/box";
import { cn } from "@/lib/utils";
import { CheckSquare } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import qs from "query-string";

const KitchenFilters = ({ kitchens }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleClick = (kitchen) => {
    const currentParams = Object.fromEntries(searchParams.entries());

    if (currentParams.kitchen === kitchen) {
      delete currentParams.kitchen;
    } else {
      currentParams.kitchen = kitchen;
    }

    const href = qs.stringifyUrl({
      url: "/menu",
      query: currentParams,
    });

    navigate(href);
  };

  return (
    <Box className="flex-col gap-2 border-b pb-4 cursor-pointer">
      <h2 className="text-xl font-semibold text-neutral-700 mt-2">Kitchen</h2>
      <Box className="flex-col gap-2 mt-2">
        {kitchens?.map((kitchen) => (
          <div
            onClick={() => handleClick(kitchen.name)}
            key={kitchen.id}
            className={cn(
              "test-sm font-semibold text-neutral-500 flex items-center my-2",
              kitchen.name === searchParams.get("kitchen") && "text-hero",
            )}
          >
            <p>{kitchen.name}</p>
            {kitchen.name === searchParams.get("kitchen") && (
              <CheckSquare className="ml-2 w-4 h-4 text-hero" />
            )}
          </div>
        ))}
      </Box>
    </Box>
  );
};

export default KitchenFilters;
