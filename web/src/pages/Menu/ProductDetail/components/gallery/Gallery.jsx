import { useState, useEffect } from "react";
import GalleryContent from "./GalleryContent";
import GalleryTab from "./GalleryTab";

const Gallery = ({ images }) => {
  const [selected, setSelected] = useState(images?.[0]?.url ?? "");

  useEffect(() => {
    if (images && images.length > 0) {
      setSelected(images[0].url);
    }
  }, [images]);

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <GalleryContent url={selected} />

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setSelected(img.url)}
              className="shrink-0 focus:outline-none"
            >
              <GalleryTab url={img.url} isActive={selected === img.url} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
