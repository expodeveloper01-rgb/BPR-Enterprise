import Box from "@/components/box";
import { cn } from "@/lib/utils";

const FilterContainer = ({ children, className }) => {
  return <Box className={cn("flex-col gap-4", className)}>{children}</Box>;
};

export default FilterContainer;
