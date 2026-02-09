import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";


export default function ResortCard({ resort }) {
    return (
    <Card className="">
    <img src={resort.image} className="h-48 w-6/8 object-cover" />
    {/*fake images collection around 2/8 length */}


    <CardContent className="p-4">
    <div className="font-semibold text-lg">{resort.name}</div>
    <div className="text-sm text-gray-500">{resort.location}</div>

    <div className="flex items-center gap-3 mt-3 text-gray-600 text-sm">
        <Star size={16} className="text-yellow-500" />
        <span>{resort.rating}</span>
        <span>({resort.reviews} reviews)</span>
    </div>

    <div className="flex flex-wrap gap-2 mt-3">
        {resort.tags?.map((tag, index) => (
        <span
            key={index}
            className="text-xs bg-gray-100 text-gray-700 px-3 py-1"
        >
            {tag}
        </span>
        ))}
    </div>
    </CardContent>

    </Card>
);
}