import React, { useState } from "react";
import { Save, Image, CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import AmenitiesEditor from "./components/AmenitiesEditor";
import HeroGalleryEditor from "./components/HeroGalleryEditor";
import ProfileEditor from "./components/ProfileEditor";
import RoomsEditor from "./components/RoomsEditor";
import ServicesEditor from "./components/ServicesEditor";

// --- SUB-COMPONENTS ---

// Floating Action Button for Exporting
const FloatingAdminControls = ({ isSaved, onSave }) => (
  <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end animate-in slide-in-from-bottom-4">
    <div className="bg-slate-900/90 text-white p-3 rounded-lg shadow-xl mb-2 text-xs backdrop-blur-md border border-slate-700">
      <p className="font-bold text-blue-400">Admin Mode Active</p>
      <p className="opacity-80">Edits preview live.</p>
    </div>
    <Button 
      onClick={onSave}
      className={`${isSaved ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} transition-all flex gap-3 rounded-full px-8 py-8 shadow-2xl text-white border-4 border-white/10`}
    >
      {isSaved ? <CheckCircle size={28} /> : <Save size={28} />}
      <span className="font-bold text-lg tracking-tight">{isSaved ? "Copied!" : "Export JS"}</span>
    </Button>
  </div>
);

// --- MAIN APP COMPONENT ---

export default function AdminResortPage() {
  const [resort, setResort] = useState({
    name: "Luxury Private Resort",
    location: "Calamba, Laguna",
    price: 28000,
    contactPhone: "+63 111 111 1111",
    contactEmail: "info@resort.com",
    contactMedia: "https://facebook.com/resort",
    profileImage: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=200&q=80",
    description: {
      summary: "Elegant, luxurious experience within reach filled with amenities designed to provide comfort and exclusivity."
    },
    extraServices: [
      { name: "Catering", description: "Food avail for discussion", cost: 3500 },
      { name: "Hot and Cold Dispenser", description: "Additional 50 Pesos per gallon", cost: 50}
    ],    
    facilities: [
        { name: "Swimming Pool", image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=500&q=60" },
        { name: "Karaoke Room", image: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&w=500&q=60" }
    ],
    tags: ["Swimming Pool", "Videoke", "Kitchen"],
    gallery: [
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80",
      "https://scontent.fmnl9-4.fna.fbcdn.net/v/t39.30808-6/515281900_122193002060299292_4215899123374760964_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHwdb2nnri3LUDWmFgGF5wyyPHsEOMeMtzI8ewQ4x4y3MemvKqie5m8QRkrPerGyq_O8TDPiZwvnn3ve_75XQpy&_nc_ohc=H9fgcm7DcvQQ7kNvwEQXRFe&_nc_oc=AdmL33TWjEPWXGr2O1lGEKqai7utrsbsEEPbN1l21TRZJ-CGAuhPs5vIVwPlgusgbgM&_nc_zt=23&_nc_ht=scontent.fmnl9-4.fna&_nc_gid=y_27F80Xo8inbD0Hglv42A&oh=00_AfuuSB73_Bcr_uaMbWIiQNwjBUNuBtz1DuNR14CGSEit-g&oe=69987A77"
    ],
    rooms: [
      {
        id: 1,
        name: "Room A",
        guests: 6,
        beds: "3 Queen Size Beds",
        price: 5200,
        details: "Airconditioned suite with garden view.",
        gallery: ["https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80"],
        tags: ["Airconditioned", "Toilet"]
      }
    ],
  });

  const [isSaved, setIsSaved] = useState(false);

  // General Update Handler
  const updateResort = (field, value) => {
    setResort(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    const jsonString = JSON.stringify(resort, null, 2);
    // Remove quotes from keys for cleaner JS
    const cleanJs = jsonString.replace(/"([^"]+)":/g, '$1:');
    const output = `export const resort = ${cleanJs};`;
    
    navigator.clipboard.writeText(output);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900 pt-10">
      
      {/* COMPONENTS */}
      <HeroGalleryEditor 
          gallery={resort.gallery} 
          onUpdate={(newGallery) => updateResort("gallery", newGallery)} 
      />
      
      <ProfileEditor 
          resort={resort} 
          onUpdate={updateResort} 
      />

      <AmenitiesEditor 
          facilities={resort.facilities} 
          onUpdate={(newFacilities) => updateResort("facilities", newFacilities)} 
      />

      <ServicesEditor 
          services={resort.extraServices} 
          onUpdate={(newServices) => updateResort("extraServices", newServices)} 
      />

      <RoomsEditor 
          rooms={resort.rooms} 
          onUpdate={(newRooms) => updateResort("rooms", newRooms)} 
      />

      {/* Floating Controls (Replaces Header) */}
      <FloatingAdminControls isSaved={isSaved} onSave={handleSave} />

    </div>
  );
}