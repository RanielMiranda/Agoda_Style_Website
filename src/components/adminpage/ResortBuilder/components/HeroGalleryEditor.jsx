import { 
  Plus, Trash2, Edit3 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroGalleryEditor({ gallery, onUpdate }) {
  const addImage = () => {
    const url = prompt("Enter Image URL for Gallery:");
    if (url) onUpdate([...gallery, url]);
  };

  const removeImage = (index) => {
    if (gallery.length <= 1) return alert("You must have at least one hero image.");
    onUpdate(gallery.filter((_, i) => i !== index));
  };

  const updateImage = (index) => {
    const url = prompt("Update Image URL:", gallery[index]);
    if (url) {
      const newGallery = [...gallery];
      newGallery[index] = url;
      onUpdate(newGallery);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pt-8 relative text-black">
      {/* Add Button */}
      <div className="absolute right-4 sm:right-8 z-20 mt-2">
        <Button 
          onClick={addImage} 
          className="backdrop-blur-sm flex items-center justify-center"
        >
          <Plus size={16} className="mr-2 text-white"/> Add Photo
        </Button>
      </div>

      {/* Main Hero Grid */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[60vh] sm:h-[50vh] md:h-[60vh] rounded-2xl overflow-hidden bg-slate-100 border-2 border-dashed border-transparent hover:border-blue-400 transition-colors">
        {gallery.slice(0, 5).map((img, idx) => (
          <div
            key={idx}
            className={`relative group ${idx === 0 ? "col-span-2 row-span-2" : ""} bg-slate-200`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />

            {/* Edit Controls */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
              <button 
                onClick={() => updateImage(idx)}
                className="p-2 bg-white rounded-full hover:bg-blue-50 text-black"
              >
                <Edit3 size={16}/>
              </button>
              <button 
                onClick={() => removeImage(idx)}
                className="p-2 bg-white rounded-full hover:bg-red-50 text-red-500"
              >
                <Trash2 size={16}/>
              </button>
            </div>

            {/* "+ More" indicator */}
            {idx === 4 && gallery.length > 5 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold pointer-events-none">
                +{gallery.length - 5} more
              </div>
            )}
          </div>
        ))}
        {gallery.length === 0 && (
           <div className="col-span-4 row-span-2 flex items-center justify-center text-slate-400">
              No images added. Click "Add Photo" to start.
           </div>
        )}
      </div>

      {/* Mini Gallery Header */}
      {gallery.length > 5 && (
        <h3 className="mt-6 mb-2 text-lg font-semibold text-black">
          Full Gallery
        </h3>
      )}

      {/* Full Gallery List */}
      {gallery.length > 5 && (
        <div className="overflow-x-auto flex gap-2 py-2">
          {gallery.map((img, idx) => (
            <div 
              key={idx} 
              className="relative flex-shrink-0 w-32 h-[20vh] sm:h-[15vh] md:h-[15vh] rounded-lg overflow-hidden bg-slate-200"
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center gap-1 transition">
                <button 
                  onClick={() => updateImage(idx)}
                  className="p-1 bg-white rounded-full hover:bg-blue-50 text-black"
                >
                  <Edit3 size={14}/>
                </button>
                <button 
                  onClick={() => removeImage(idx)}
                  className="p-1 bg-white rounded-full hover:bg-red-50 text-red-500"
                >
                  <Trash2 size={14}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
