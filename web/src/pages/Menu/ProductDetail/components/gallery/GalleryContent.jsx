const GalleryContent = ({ url }) => {
  return (
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-neutral-100">
      <img src={url} alt="" className="absolute inset-0 w-full h-full object-contain" />
    </div>
  );
};

export default GalleryContent;
