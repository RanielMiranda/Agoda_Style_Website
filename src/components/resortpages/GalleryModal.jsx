export default function GalleryModal({
  images,
  activeIndex,
  setActiveIndex,
  onClose,
}) {
  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white text-3xl"
      >
        ✕
      </button>

      <div className="relative w-full flex items-center justify-between px-4 h-[70vh]">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveIndex((i) => (i - 1 + images.length) % images.length);
          }}
          className="text-white text-4xl"
        >
          ←
        </button>

        <img
          src={images[activeIndex]}
          className="max-h-full max-w-full object-contain"
        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveIndex((i) => (i + 1) % images.length);
          }}
          className="text-white text-4xl"
        >
          →
        </button>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex(i);
            }}
            className={`h-16 w-24 object-cover rounded cursor-pointer ${
              i === activeIndex ? "ring-2 ring-blue-500" : "opacity-50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
