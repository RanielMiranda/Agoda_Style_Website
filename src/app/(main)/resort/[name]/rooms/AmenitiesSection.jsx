import React, { useRef } from "react";

export default function AmenitiesSection({ facilities, onOpen }) {
  const safeFacilities = Array.isArray(facilities) ? facilities : [];
  const maxVisible = 10;
  const visibleFacilities = safeFacilities.slice(0, maxVisible);
  const hasMore = safeFacilities.length > maxVisible;

  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  const openModal = (idx) => onOpen?.(idx);

  const onMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftStart.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = "grabbing";
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1; // scroll speed
    scrollRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const onMouseUpOrLeave = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  };

  return (
    <div id="facilities" className="max-w-6xl mx-auto px-4">
      <h2 className="text-2xl font-semibold mb-4">Facilities</h2>

      {/* Horizontal Gallery */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto py-2 cursor-grab"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUpOrLeave}
        onMouseLeave={onMouseUpOrLeave}
      >
        {visibleFacilities.map((facility, idx) => {
          const isLast = idx === maxVisible - 1 && hasMore;
          return (
            <div
              key={idx}
              className="flex-shrink-0 w-24 cursor-pointer group relative"
              onClick={() => openModal(idx)}
            >
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 relative">
                <img
                  src={facility?.image || ""}
                  alt={facility?.name || "Facility"}
                  className={`w-full h-full object-cover transition-transform group-hover:scale-110 ${
                    isLast ? "brightness-50" : ""
                  }`}
                />
                {isLast && hasMore && (
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                    View More
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm font-medium text-center">{facility?.name || "Facility"}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
