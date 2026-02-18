import { Card } from "@/components/ui/card";
import { Users, BedDouble } from "lucide-react";
import { useResort } from "../../context/ContextEditor"; 
import { useFilters } from "../../context/ContextFilter"; 

export default function RoomsSection({ onOpenRoomGallery }) {
  const { resort } = useResort(); 
  const { selectedTags } = useFilters(); 

  if (!resort || !resort.rooms) return null;

  // Filter rooms: If user has selected tags, only show rooms that contain EVERY selected tag
  const displayedRooms = resort.rooms.filter((room) => {
    if (selectedTags.length === 0) return true;
    return selectedTags.every(tag => room.tags?.includes(tag));
  });

  return (
    <div id="rooms" className="max-w-6xl mx-auto px-4 pb-16">
      <h2 className="text-2xl font-bold mb-6">Available Accommodations</h2>
      
      <div className="flex flex-col gap-6">
        {displayedRooms.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-500 font-medium">No rooms match your selected amenities.</p>
            <p className="text-sm text-slate-400 mt-1">Try deselecting some tags in the filter panel.</p>
          </div>
        ) : (
          displayedRooms.map((room) => (
            <Card key={room.id} className="rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-md border-slate-100 hover:shadow-lg transition-shadow">
              
              {/* Image Gallery Grid */}
              <div className="md:w-1/2 h-[260px] grid grid-cols-2 grid-rows-2 gap-1 bg-slate-200">
                <img
                  src={room.gallery?.[0] || resort.gallery[0]}
                  onClick={() => onOpenRoomGallery(room.gallery, 0)}
                  className="col-span-1 row-span-2 object-cover w-full h-full cursor-pointer hover:brightness-90 transition"
                />
                {room.gallery?.[1] && (
                  <img
                    src={room.gallery[1]}
                    onClick={() => onOpenRoomGallery(room.gallery, 1)}
                    className="object-cover w-full h-full cursor-pointer hover:brightness-90 transition"
                  />
                )}
                {room.gallery?.[2] && (
                  <div className="relative h-full w-full">
                    <img
                      src={room.gallery[2]}
                      onClick={() => onOpenRoomGallery(room.gallery, 2)}
                      className="object-cover w-full h-full cursor-pointer hover:brightness-90 transition"
                    />
                    {room.gallery.length > 3 && (
                      <div
                        className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold cursor-pointer"
                        onClick={() => onOpenRoomGallery(room.gallery, 3)}
                      >
                        +{room.gallery.length - 2}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Room Details */}
              <div className="md:w-1/2 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">{room.name}</h3>
                  
                  <div className="flex gap-3 mb-4">
                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                      <Users size={16} /> {room.guests} Guests
                    </div>
                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                      <BedDouble size={16} /> {room.beds} Beds
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {room.tags?.map((tag, i) => (
                      <span
                        key={i}
                        className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded font-bold ${
                          selectedTags.includes(tag) 
                            ? "bg-blue-600 text-white" 
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {room.details && (
                    <p className="text-slate-500 text-sm mt-4 italic line-clamp-2">{room.details}</p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-end justify-between">
                  <div>
                    <span className="text-3xl font-black text-blue-600">₱{room.price?.toLocaleString()}</span>
                    <span className="text-slate-400 text-xs font-bold ml-1">/ NIGHT</span>
                  </div>
                  <button className="bg-slate-900 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}