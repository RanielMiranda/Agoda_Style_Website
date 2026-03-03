"use client";

import React from "react";
import { useFilters } from "@/components/useclient/ContextFilter";

export default function FilterPanel() {
  const {
    priceRange,
    setPriceRange,
    selectedTags,
    setSelectedTags,
    fetchResorts,
    loading,
    lastFetchedAt,
  } = useFilters();

  const handleTagChange = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="w-full lg:w-80 bg-white shadow rounded-2xl p-6 h-fit lg:sticky lg:top-24">
      <h3 className="font-semibold text-lg mb-4">Filters</h3>

      <div className="mb-6">
        <p className="font-medium mb-2">Target Price Range</p>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-500 font-semibold">
            <span>Min: PHP {Number(priceRange?.min || 0).toLocaleString()}</span>
            <span>Max: PHP {Number(priceRange?.max || 0).toLocaleString()}</span>
          </div>

          <input
            type="range"
            min="1000"
            max="50000"
            step="500"
            value={priceRange?.min || 10000}
            onChange={(e) => setPriceRange((prev) => ({ ...prev, min: Number(e.target.value) }))}
            className="w-full"
          />
          <input
            type="range"
            min="1000"
            max="50000"
            step="500"
            value={priceRange?.max || 30000}
            onChange={(e) => setPriceRange((prev) => ({ ...prev, max: Number(e.target.value) }))}
            className="w-full"
          />

          <p className="text-[10px] text-slate-400 uppercase tracking-wider">
            Resorts closer to your range appear higher.
          </p>
        </div>
      </div>

      <div>
        <p className="font-medium mb-2">Amenities</p>
        <div className="flex flex-col gap-2">
          {["Wifi", "Kitchen", "Swimming Pool", "Videoke", "Natural Hot Spring", "Billiard Table"].map((tag) => (
            <label key={tag} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={() => handleTagChange(tag)}
              />
              {tag}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100">
        <button
          onClick={fetchResorts}
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 text-white text-xs font-bold uppercase tracking-wider py-3 hover:bg-black disabled:opacity-60"
        >
          {loading ? "Applying filters..." : "Search"}
        </button>
      </div>
    </div>
  );
}
