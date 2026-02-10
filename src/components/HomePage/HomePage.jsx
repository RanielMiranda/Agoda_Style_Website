import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeroBanner from "../components/HomePage/hero/HeroBanner";
import ResortList from "../components/HomePage/resort/ResortList";

export default function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.state]);

  return (
    <>
      <HeroBanner />
      <div id="resorts">
        <ResortList />
      </div>

      <div id="about" className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-4">About</h2>
        <p className="text-gray-600">
          This is a prototype website for showcasing resorts.
        </p>
      </div>
    </>
  );
}
