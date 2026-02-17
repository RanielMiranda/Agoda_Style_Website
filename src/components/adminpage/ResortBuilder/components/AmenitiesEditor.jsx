import { 
  Plus, Trash2, Save, Image as ImageIcon, 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AmenitiesEditor ({ facilities, onUpdate }) {
  const addAmenity = () => {
    onUpdate([...facilities, { name: "New Amenity", image: "https://via.placeholder.com/150" }]);
  };

  const updateAmenity = (index, field, value) => {
    const updated = [...facilities];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate(updated);
  };

  const removeAmenity = (index) => {
    onUpdate(facilities.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 mt-8">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-2xl font-semibold">Amenities</h2>
      </div>

      {/* Horizontal Gallery matching FacilitiesGallery.jsx */}
      <div className="flex gap-4 overflow-x-auto py-4 cursor-grab pb-8">
        {facilities.map((facility, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-24 group relative"
            >
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 relative shadow-sm hover:shadow-md transition">
                <img
                  src={facility.image}
                  alt={facility.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Hover Editing Controls */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2">
                    <button 
                        onClick={() => updateAmenity(idx, "image", prompt("Image URL:", facility.image))}
                        className="p-1 bg-white rounded-full text-black hover:scale-110 transition"
                    >
                        <ImageIcon size={12}/>
                    </button>
                    <button 
                        onClick={() => removeAmenity(idx)}
                        className="p-1 bg-white rounded-full text-red-500 hover:scale-110 transition"
                    >
                        <Trash2 size={12}/>
                    </button>
                </div>
              </div>
              <input 
                className="mt-2 text-sm font-medium text-center w-full bg-transparent border-none p-0 focus:ring-0 focus:text-blue-600"
                value={facility.name}
                onChange={(e) => updateAmenity(idx, "name", e.target.value)}
              />
            </div>
        ))}
        {/* Add Button at end of list */}
        <button 
            onClick={addAmenity}
            className="flex-shrink-0 w-24 aspect-square rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 transition hover:bg-blue-50"
        >
            <Plus size={24} />
            <span className="text-xs font-bold mt-1">Add</span>
        </button>
      </div>
    </div>
  );
};