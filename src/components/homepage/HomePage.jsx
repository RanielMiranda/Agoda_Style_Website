import React from "react";
import HeroBanner from "./hero/HeroBanner";
import ResortSection from "./resort/ResortSection"

export default function homepage() {
  return (
    <>
      <HeroBanner />

      {/* Resorts Section */}
      <div id="resorts">
        <ResortSection />
      </div>

      {/* About Section */}
      <div id="about" className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-4">About</h2>
        <p className="text-gray-600">
          This is a prototype website for showcasing resorts.
        </p>
      </div>
    </>
  );
}
