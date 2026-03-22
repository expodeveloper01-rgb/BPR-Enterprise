const GalleryTab = ({ url, isActive }) => {
  return (
    <div
      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
        isActive ? "border-black" : "border-gray-100 hover:border-gray-300"
      }`}
    >
      <img src={url} alt="" className="w-full h-full object-cover" />
    </div>
  );
};

export default GalleryTab;
