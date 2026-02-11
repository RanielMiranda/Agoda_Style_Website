import FacilitiesGallery from "./FacilitiesGallery";

export default function ResortInfo({ resort, onFacilityOpen }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">{resort.name}</h1>

      <p className="mt-2">{resort.details}</p>

      {/* TAGS (TEXT ONLY) */}
      <div className="flex flex-wrap gap-2 mt-4">
        {resort.tags?.map((tag, i) => (
          <span
            key={i}
            className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* FACILITIES (IMAGES) */}
      <FacilitiesGallery
        facilities={resort.facilities}
        onOpen={onFacilityOpen}
      />
    </div>
  );
}
