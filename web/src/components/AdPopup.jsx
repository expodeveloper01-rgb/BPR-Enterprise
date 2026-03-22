import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CircleX } from "lucide-react";

const AdPopup = ({ data }) => {
  const [showPopup, setShowPopup] = useState(true);
  const [animatePopup, setAnimatePopup] = useState(false);

  useEffect(() => {
    const storedProductId = localStorage.getItem("lastProductId");

    if (storedProductId !== data.id.toString()) {
      setShowPopup(true);
      setAnimatePopup(true);
      localStorage.setItem("lastProductId", data.id);

      const timer = setTimeout(() => {
        setAnimatePopup(false);
        setTimeout(() => setShowPopup(true), 300);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [data.id]);

  if (!showPopup) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 bg-white p-4 shadow-lg rounded-md w-80 z-50 ${
        animatePopup ? "opacity-100" : "opacity-0"
      }`}
      style={{ transition: "opacity 0.5s ease-in-out" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-neutral-800">
          Latest Product
        </h4>
        <CircleX
          className="cursor-pointer"
          onClick={() => {
            setAnimatePopup(false);
            setTimeout(() => setShowPopup(false), 300);
          }}
        />
      </div>
      <div className="flex items-center">
        <div className="w-24 h-24 relative mr-4 overflow-hidden rounded-md">
          <img
            src={data.images[0].url}
            alt={data.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h5 className="text-sm font-bold">{data.name}</h5>
          <p className="text-sm text-neutral-600">₱{data.price}</p>
          <Link to={`/menu/${data.id}`}>
            <Button size="sm" className="mt-2">
              Order Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdPopup;
