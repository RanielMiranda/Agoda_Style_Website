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
    </>
  );
}
