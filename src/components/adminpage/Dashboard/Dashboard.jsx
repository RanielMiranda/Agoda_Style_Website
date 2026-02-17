import React, { useState } from "react";
import { Plus, Edit2, MapPin, Globe, Trash2, ArrowLeft, LayoutDashboard, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import ResortJsBuilder from "../ResortBuilder/ResortBuilder"; 
import { resorts as resortsData } from "@/components/data/resorts";

export default function Dashboard() {
  const [view, setView] = useState("list"); 
  const [resorts, setResorts] = useState(resortsData);
  const [editingResort, setEditingResort] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter resorts based on search
  const filteredResorts = resorts.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingResort({
      name: "",
      location: "",
      price: 0,
      contactPhone: "",
      contactEmail: "",
      description: { summary: "" },
      profileImage: "",
      gallery: [],
      facilities: [],
      extraServices: [],
      rooms: [],
      tags: [],
    });
    setView("edit");
  };

  const handleEdit = (resort) => {
    setEditingResort(resort);
    setView("edit");
  };

  const handleDelete = (name) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      setResorts(resorts.filter(r => r.name !== name));
    }
  };

  const handleBackToList = () => {
    setView("list");
    setEditingResort(null);
  };

  if (view === "edit") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b sticky top-0 z-50 pt-10">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBackToList}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
              <h1 className="font-bold text-lg">
                {editingResort?.name ? `Editing: ${editingResort.name}` : "Create New Resort"}
              </h1>
            </div>
            <div className="text-sm text-gray-500 font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
              Builder Active
            </div>
          </div>
        </div>
        
        <div className="p-4 md:p-8">
          <ResortJsBuilder initialData={editingResort} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto pt-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <LayoutDashboard className="text-blue-600" />
              Resort Management
            </h1>
            <p className="text-slate-500 mt-1">Manage, edit, and add new properties to your directory.</p>
          </div>
          <Button 
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 h-12 shadow-lg shadow-blue-200 transition-all hover:scale-105 flex items-center justify-center"
          >
            <Plus className="mr-2 h-5 w-5 " />
            Add New Resort
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-white border-none shadow-sm flex flex-col justify-center rounded-2xl">
            <span className="text-slate-500 text-sm">Total Resorts</span>
            <span className="text-2xl font-bold">{resorts.length}</span>
          </Card>
          <div className="md:col-span-3 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input 
              type="text"
              placeholder="Search by name or location..."
              className="w-full h-full min-h-[56px] pl-12 pr-4 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredResorts.length > 0 ? (
            filteredResorts.map((resort) => (
              <Card key={resort.name} className="p-4 bg-white border-none shadow-sm hover:shadow-md transition-shadow group rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <img 
                      src={resort.profileImage || (resort.gallery && resort.gallery[0]) || "https://via.placeholder.com/150"} 
                      alt={resort.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-slate-900 truncate">{resort.name}</h2>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} /> {resort.location || "No location set"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Globe size={14} /> {resort.rooms?.length || 0} Room Types
                      </span>
                      <span className="font-semibold text-blue-600">
                        ₱{resort.price?.toLocaleString() || 0} / night
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(resort)}
                      className="rounded-lg border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 flex items-center justify-center"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(resort.name)}
                      className="rounded-lg border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border-2 border-dashed border-slate-200">
              <p className="text-slate-400">No resorts found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}