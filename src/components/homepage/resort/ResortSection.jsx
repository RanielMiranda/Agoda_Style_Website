import React, { useState } from "react";
import { resorts } from "../../data/resorts";
import FilterPanel from "./FilterPanel";
import ResortResults from "./ResortResults";

export default function ResortSection() {
  const [price, setPrice] = useState(5000);

  return (
    <section id="resorts" className="w-full max-w-[1600px] mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8">Top Resorts</h2>

      {/* Mobile: stacked | Desktop: side-by-side */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* FILTERS */}
        <FilterPanel price={price} setPrice={setPrice} />

        {/* RESULTS */}
        <ResortResults resorts={resorts} />
      </div>
    </section>
  );
}
