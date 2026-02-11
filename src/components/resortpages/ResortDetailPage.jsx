import React, {useState} from "react";
import { useParams } from "react-router-dom";
import { resorts } from "../data/resorts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users, BedDouble, Flag } from "lucide-react";
import { HashLink } from "react-router-hash-link";
import StarFill from "../ui/StarFill";

export default function ResortDetailPage() {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);  

  const { name } = useParams();
  const resort = resorts.find((r) => r.name === decodeURIComponent(name));
  if (!resort) {
    return (
      <div className="p-10 text-center text-gray-500">Resort not found</div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen mt-10">

      {/* ================= HERO IMAGE ================= */}
      <div className="w-full max-w-6xl mx-auto px-4 pt-8">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[380px] rounded-2xl overflow-hidden">
          {resort.gallery?.slice(0, 5).map((img, idx) => (
            <div
              key={idx}
              onClick={() => {
                setActiveIndex(idx);
                setGalleryOpen(true);
              }}
              className={`cursor-pointer w-full h-full ${
                idx === 0 ? "col-span-2 row-span-2" : ""
              } relative`}
            >
              <img
                src={img}
                alt={`${resort.name} ${idx}`}
                className="w-full h-full object-cover"
              />

              {idx === 4 && resort.gallery.length > 5 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold">
                  +{resort.gallery.length - 5} more
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ================= SHORTCUT BAR ================= */}
      <div className="bg-white border-b mt-6">
        <div className="max-w-6xl mx-auto px-4 py-3 flex gap-6 text-sm font-medium text-gray-600">
          <button className="hover:text-blue-600">Overview</button>
          <HashLink smooth to="#rooms" className="hover:text-blue-600 transition">
            Available Rooms
          </HashLink>
          <HashLink smooth to="#amenities" className="hover:text-blue-600 transition">
            Amenities
          </HashLink>
        </div>
      </div>

      {/* ================= RESORT INFO ================= */}
      <div className="max-w-6xl mx-auto px-4 py-8 flex md:flex-row gap-6">
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold">{resort.name}</h1>
            <div className="flex items-center gap-1 my-1">
              <MapPin size={16} />
              <span>{resort.location}</span>
            </div>         
             
          <div className="flex items-center gap-4 text-gray-600 mt-3">
            <div className="flex items-center gap-2">
              <StarFill rating={resort.rating} size={16} />
              <span className="text-sm text-gray-600">{resort.rating}</span>
              <span className="text-sm text-gray-500">({resort.reviews} reviews)</span>
            </div>
          </div>   

          <p className="mt-1">{resort.details}</p>

          <div className="flex flex-wrap gap-2 pt-2 mt-2">
            {resort.tags?.map((tag, i) => (
              <span
                key={i}
                className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* ================= FACILITIES ================= */}
          <div id = "amenities" className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Facilities</h2>
            <div className="flex flex-wrap gap-4">
              {resort.facilities?.map((f, i) => (
                <span
                  key={i}
                  className="text-xs bg-gray-100 px-3 py-1 rounded-full"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= ROOMS ================= */}
      <div id = "rooms" className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-semibold mb-6">Available Rooms</h2>
        <div className="flex flex-col gap-6">
          {resort.rooms?.map((room) => (
            <Card key={room.id} className="overflow-hidden rounded-2xl flex flex-col md:flex-row shadow-md">
              
              {/* ================= IMAGE MOSAIC ================= */}
              <div className="md:w-1/2 h-[260px] grid grid-cols-2 grid-rows-2 gap-1">
                {/* Image 1 Large */}
                <div className="col-span-1 row-span-2">
                  <img
                    src={room.gallery?.[0] || resort.gallery[0]}
                    alt=""
                    className="w-full h-full object-cover rounded-tl-xl rounded-bl-xl"
                  />
                </div>

                {/* Image 2 Top Right */}
                {room.gallery?.[1] && (
                  <div className="col-span-1 row-span-1">
                    <img
                      src={room.gallery[1]}
                      alt=""
                      className="w-full h-full object-cover rounded-tr-xl"
                    />
                  </div>
                )}

                {/* Image 3 Bottom Right */}
                {room.gallery?.[2] && (
                  <div className="relative col-span-1 row-span-1">
                    <img
                      src={room.gallery[2]}
                      alt=""
                      className="w-full h-full object-cover rounded-br-xl"
                    />
                    {room.gallery.length > 3 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-br-xl text-white font-semibold">
                        +{room.gallery.length - 2} more
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ================= DATA + PRICE ================= */}
              <div className="md:w-1/2 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
                  <div className="flex gap-2 text-sm mb-4">
                    <div className="flex items-center gap-2 bg-blue-100 px-2 py-1 rounded-2xl">
                      <Users size={16} /> {room.guests} Guests
                    </div>
                    <div className="flex items-center gap-2 bg-blue-100 px-2 py-1 rounded-2xl">
                      <BedDouble size={16} /> {room.beds} bed
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3 ">
                    {room.tags?.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs bg-gray-100 px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {room.details && (
                    <p className="text-gray-500 text-sm mt-2">{room.details}</p>
                  )}
                </div>

                <div className="flex items-end justify-between mt-6">
                  <div>
                    <p className="text-sm text-gray-500">Price per night</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ₱{room.price.toLocaleString()}
                    </p>
                  </div>

                  <Button className="px-3 py-3 text-md flex items-center gap-2 hover:scale-105 transition-transform"> 
                    <Flag className="w-4 h-4 text-white" />
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
{galleryOpen && (
  <div 
    className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center animate-in fade-in duration-200"
    onClick={() => setGalleryOpen(false)} // Clicking the backdrop closes the gallery
  >
    {/* Close Button - Outside the main flow to keep it top-right */}
    <button
      onClick={() => setGalleryOpen(false)}
      className="absolute top-6 right-6 text-white/70 hover:text-white text-3xl z-[60] p-2 transition-colors"
    >
      ✕
    </button>

    {/* Main Interaction Area: Arrows and Image */}
    <div className="relative w-full flex items-center justify-between px-4 md:px-10 h-[70vh]">
      
      {/* Previous Arrow */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevents closing the gallery
          setActiveIndex((prev) => (prev - 1 + resort.gallery.length) % resort.gallery.length);
        }}
        className="p-4 text-white hover:bg-white/10 rounded-full transition-all"
      >
        <span className="text-4xl">←</span>
      </button>

      {/* Image Container */}
      <div 
        className="flex-1 flex justify-center items-center h-full mx-4"
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking the image itself
      >
        <img
          src={resort.gallery[activeIndex]}
          alt="Resort Gallery"
          className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
        />
      </div>

      {/* Next Arrow */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevents closing the gallery
          setActiveIndex((prev) => (prev + 1) % resort.gallery.length);
        }}
        className="p-4 text-white hover:bg-white/10 rounded-full transition-all"
      >
        <span className="text-4xl">→</span>
      </button>
    </div>

    {/* Thumbnails Container */}
    <div 
      className="mt-8 flex gap-2 overflow-x-auto max-w-[90vw] pb-4 px-4 no-scrollbar"
      onClick={(e) => e.stopPropagation()} // Prevents closing when clicking thumbnails
    >
      {resort.gallery.map((img, i) => (
        <img
          key={i}
          src={img}
          alt="Thumbnail"
          onClick={() => setActiveIndex(i)}
          className={`h-16 w-24 flex-shrink-0 object-cover rounded cursor-pointer transition-opacity ${
            i === activeIndex ? "ring-2 ring-blue-500 opacity-100" : "opacity-50 hover:opacity-80"
          }`}
        />
      ))}
    </div>
  </div>
)}
    </div>
  );
}
