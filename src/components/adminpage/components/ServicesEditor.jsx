import { 
  Plus, Trash2, Image
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ServicesEditor ({ services, onUpdate }) {
  const addService = () => {
    const name = prompt("Service name:");
    if (name) onUpdate([...services, { name, description: "Service Description", cost: 0 }]);
  };

  const updateService = (index, field, value) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate(updated);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 mt-8">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-2xl font-semibold">Extra Services</h2>
        <Button variant="outline" size="sm" onClick={addService} className="rounded-full text-xs h-8 flex items-center justify-center">
            <Plus size={14} className="mr-1"/> Add
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
        {services.map((service, i) => (
          <div key={i} className="flex flex-col gap-1 p-3 rounded-lg hover:bg-white hover:shadow-md transition group border border-transparent hover:border-gray-100">
             <div className="flex justify-between items-start">
                <input 
                    className="font-medium bg-transparent border-none p-0 focus:ring-0 w-full"
                    value={service.name}
                    onChange={(e) => updateService(i, "name", e.target.value)}
                />
                <button onClick={() => onUpdate(services.filter((_, idx) => idx !== i))} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition">
                    <Trash2 size={14} />
                </button>
             </div>
             <input 
                className="text-sm text-gray-500 bg-transparent border-none p-0 focus:ring-0 w-full"
                value={service.description}
                onChange={(e) => updateService(i, "description", e.target.value)}
             />
             <div className="font-semibold text-blue-600 mt-1 flex items-center">
                ₱<input 
                    type="number"
                    className="bg-transparent border-none p-0 focus:ring-0 w-24 font-semibold text-blue-600"
                    value={service.cost}
                    onChange={(e) => updateService(i, "cost", Number(e.target.value))}
                />
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};