import { 
  Plus, Image as ImageIcon, 
  X, DollarSign, MapPin, Phone, Mail, Facebook
} from "lucide-react";

export default function ProfileEditor ({ resort, onUpdate }) {
  const addTag = () => {
    const tag = prompt("Enter new tag (e.g. Free WiFi):");
    if (tag) onUpdate("tags", [...resort.tags, tag]);
  };

  const removeTag = (index) => {
    const tagName = resort.tags[index];
      if (window.confirm(`Are you sure you want to remove the tag "${tagName}"?`)) {
        onUpdate("tags", resort.tags.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="relative group shrink-0">
          <img src={resort.profileImage} className="w-32 h-32 rounded-full object-cover ring-4 ring-slate-100 shadow-lg" alt="Profile" />
          <button 
            className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white"
            onClick={() => onUpdate("profileImage", prompt("New profile image URL:", resort.profileImage))}
          >
            <ImageIcon size={20} />
          </button>
        </div>

        <div className="flex-1 w-full space-y-4">
          <input 
            className="text-4xl font-black w-full bg-transparent border-none focus:ring-0 p-0 hover:bg-slate-50 rounded transition placeholder:text-slate-300"
            value={resort.name}
            onChange={(e) => onUpdate("name", e.target.value)}
            placeholder="Resort Name"
          />
          
          <div className="flex flex-col gap-2 text-gray-800">
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <input 
                 className="bg-transparent border-none p-1 focus:ring-0 hover:bg-slate-50 rounded w-full font-medium"
                 value={resort.location}
                 onChange={(e) => onUpdate("location", e.target.value)}
                 placeholder="Add Location"
              />
            </div>
            
            <div className="flex items-center gap-1">
              <Facebook size={16} />
              <input 
                 className="bg-transparent border-none p-1 focus:ring-0 hover:bg-slate-50 rounded w-full text-blue-600 underline"
                 value={resort.contactMedia}
                 onChange={(e) => onUpdate("contactMedia", e.target.value)}
                 placeholder="Add Facebook Link"
              />
            </div>

            <div className="flex items-center gap-1">
               <Mail size={16} />
               <input 
                 className="bg-transparent border-none p-1 focus:ring-0 hover:bg-slate-50 rounded w-full"
                 value={resort.contactEmail}
                 onChange={(e) => onUpdate("contactEmail", e.target.value)}
                 placeholder="Add Email"
              />
            </div>

            <div className="flex items-center gap-1">
               <Phone size={16} />
               <input 
                 className="bg-transparent border-none p-1 focus:ring-0 hover:bg-slate-50 rounded w-full"
                 value={resort.contactPhone}
                 onChange={(e) => onUpdate("contactPhone", e.target.value)}
                 placeholder="Add Phone"
              />
            </div>
             <div className="flex items-center gap-1">
               <DollarSign size={16} />
               <input 
                 type="number"
                 className="bg-transparent border-none p-1 focus:ring-0 hover:bg-slate-50 rounded w-full"
                 value={resort.price}
                 onChange={(e) => onUpdate("price", Number(e.target.value))}
                 placeholder="Base Price"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-8">
        <textarea 
          className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-slate-600 leading-relaxed focus:border-blue-400 focus:bg-white outline-none transition"
          rows={5}
          value={resort.description.summary}
          onChange={(e) => onUpdate("description", { summary: e.target.value })}
        />
      </div>

      {/* Resort Tags */}
      <div className="mt-4 flex flex-wrap gap-2">
          {resort.tags.map((tag, i) => (
            <div key={i} className="group relative bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2">
              {tag}
              <X size={12} className="cursor-pointer text-blue-400 hover:text-red-500" onClick={() => removeTag(i)} />
            </div>
          ))}
          <button onClick={addTag} className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
             <Plus size={12} /> Add Tag
          </button>
      </div>
    </div>
  );
};