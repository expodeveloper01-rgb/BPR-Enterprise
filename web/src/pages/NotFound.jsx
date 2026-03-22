import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
      {/* Large decorative number */}
      <div className="relative mb-6 select-none">
        <span className="text-[10rem] md:text-[14rem] font-black text-neutral-100 leading-none">
          404
        </span>
        <span className="absolute inset-0 flex items-center justify-center text-3xl md:text-4xl font-bold text-neutral-800">
          Page not found
        </span>
      </div>

      <p className="text-muted-foreground max-w-sm mb-8">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might
        have been moved or doesn&apos;t exist.
      </p>

      <Link to="/">
        <Button className="rounded-full px-6 bg-black text-white hover:bg-black/80 gap-2">
          <Home className="w-4 h-4" />
          Back to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
