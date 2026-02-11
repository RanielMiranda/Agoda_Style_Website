export default function FacilitiesGallery({ facilities, onOpen }) {
  return (
    <div id="amenities" className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Facilities</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {facilities.map((facility, index) => (
          <div
            key={index}
            onClick={() => onOpen(index)}
            className="cursor-pointer group"
          >
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
              <img
                src={facility.image}
                alt={facility.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>

            <p className="mt-2 text-sm font-medium text-center">
              {facility.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
