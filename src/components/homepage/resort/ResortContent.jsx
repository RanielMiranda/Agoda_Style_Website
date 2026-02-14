import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Mail, Phone } from "lucide-react";

export default function ResortContent({ resort }) {
  const gallery = resort.gallery || [];

  return (
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {resort.profileImage && (
            <img
              src={resort.profileImage}
              alt={resort.name}
              className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-200"
            />
          )}

          <div className="font-semibold text-lg">{resort.name}</div>
        </div>
          <div className="text-sm text-gray-500">
            <div className="flex items-center gap-1 my-1">
              <MapPin size={16} />
              <span> {resort.location} </span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            <div className="flex items-center gap-1 my-1">
              <Mail size={16} />
              <span> {resort.contactPhone} </span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            <div className="flex items-center gap-1 my-1">
              <Phone size={16} />
              <span> {resort.contactEmail} </span>
            </div>
          </div>                    

        <div className="flex flex-wrap gap-2 mt-3">
          {resort.tags?.map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
    </CardContent>
  );
}