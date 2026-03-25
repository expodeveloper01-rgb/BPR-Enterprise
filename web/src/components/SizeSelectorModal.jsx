import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const SizeSelectorModal = ({
  isOpen,
  sizes,
  onSelectSize,
  onClose,
  productName,
}) => {
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedSize(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = () => {
    if (selectedSize) {
      onSelectSize(selectedSize);
      setSelectedSize(null);
    }
  };

  const handleClose = () => {
    setSelectedSize(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
        <h2 className="text-lg font-bold text-neutral-900 mb-4">
          Select Size {productName ? `for ${productName}` : ""}
        </h2>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {sizes && sizes.length > 0 ? (
            sizes.map((size) => (
              <button
                key={size.id}
                onClick={() => setSelectedSize(size)}
                className={`p-3 rounded-lg border-2 font-medium transition-all ${
                  selectedSize?.id === size.id
                    ? "border-black bg-black text-white"
                    : "border-gray-200 text-neutral-700 hover:border-gray-300"
                }`}
              >
                {size.name}
              </button>
            ))
          ) : (
            <p className="col-span-2 text-center text-muted-foreground">
              No sizes available
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleClose}
            variant="ghost"
            className="flex-1 rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSelect}
            disabled={!selectedSize}
            className="flex-1 bg-black text-white hover:bg-black/80 rounded-xl"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SizeSelectorModal;
