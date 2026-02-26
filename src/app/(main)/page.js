import React from "react";
import HeroBanner from "./components/hero/HeroBanner";
import ResortSection from "./components/resort/ResortSection"

export default function Page() {
  return (
    <>
      <HeroBanner />
      <div id="resorts">
        <ResortSection />
      </div>
    </>
  );
}
