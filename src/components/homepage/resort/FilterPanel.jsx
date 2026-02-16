import React from "react";

export default function FilterPanel({ price, setPrice }) {
  return (
    <div className="w-full lg:w-80 bg-white shadow rounded-2xl p-6 h-fit lg:sticky lg:top-24">
      <h3 className="font-semibold text-lg mb-4">Filters</h3>

      {/* PRICE */}
      <div className="mb-6">
        <p className="font-medium mb-2">Price / night</p>

        <div className="flex flex-col gap-2 px-1">
          <input
            type="range"
            min="1000"
            max="10000"
            value={price}
            onChange={(e) => {
              const val = Math.max(
                1000,
                Math.min(10000, Number(e.target.value))
              );
              setPrice(val);
            }}
            className="w-full"
          />

          <div className="flex items-center border rounded-lg px-2">
            <span className="text-gray-500 text-sm">₱</span>
            <input
              type="number"
              value={price}
              onChange={(e) => {
                const val = Math.max(
                  1000,
                  Math.min(10000, Number(e.target.value))
                );
                setPrice(val);
              }}
              className="w-full px-2 py-1 text-sm outline-none"
            />
          </div>
        </div>
      </div>

      {/* TAGS */}
      <div>
        <p className="font-medium mb-2">Tags</p>
        <div className="flex flex-col gap-2 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Wifi
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Kitchen
          </label>
        </div>
      </div>
    </div>
  );
}
