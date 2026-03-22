import { cn } from "@/lib/utils";

const Box = ({ children, className }) => {
  return (
    <div className={cn("mx-auto w-full items-start justify-start", className)}>
      {children}
    </div>
  );
};

export default Box;
