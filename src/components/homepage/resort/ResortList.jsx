import React, { useState } from "react";
import ResortCard from "./ResortCard";
import { resorts } from "../../data/resorts";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function ResortList() {
const [price, setPrice] = useState(5000);
const navigate = useNavigate();

    return (
    <div id="resorts" className="w-full lg:w-4/6 mx-auto px-4 py-12">

    <h2 className="text-3xl font-bold mb-8">Top Resorts</h2>
    {/* Layout: Sidebar + Content */}
    <div className="flex gap-8">
        {/* ===== FILTER SIDEBAR ===== */}
        <div className="w-64 bg-white shadow rounded-2xl p-6 h-fit sticky top-24">

        <h3 className="font-semibold text-lg mb-4">Filters</h3>

        {/* Price */}
        <div className="mb-6">
            <p className="font-medium mb-2">Price / night</p>
                <div className="flex flex-col gap-2 px-2">
                <input
                    type="range"
                    min="1000"
                    max="10000"
                    value={price}
                    onChange={(e) => {
                        const val = Math.max(1000, Math.min(10000, Number(e.target.value)));
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
                        const val = Math.max(1000, Math.min(10000, Number(e.target.value)));
                        setPrice(val);
                    }}
                    className="w-full px-2 py-1 text-sm outline-none"
                />
                </div>
                </div>
        </div>

        {/* Tags */}
        <div className="mb-6">
            <p className="font-medium mb-2">Tags</p>
            <div className="flex flex-col gap-2 text-sm">
            <label><input type="checkbox" /> Wifi </label>
            <label><input type="checkbox" /> Kitchen </label>
            </div>
        </div>

        {/* Rating */}
        <div className="mb-6">
            <p className="font-medium mb-2">Star Rating</p>
            <div className="flex flex-col gap-2 text-sm">
            <label><input type="checkbox" /> 5 Star</label>
            <label><input type="checkbox" /> 4 Star & up</label>
            <label><input type="checkbox" /> 3 Star & up</label>
            </div>
        </div>

        {/* Reviews */}
        <div className="mb-6">
            <p className="font-medium mb-2">Reviews</p>
            <div className="flex flex-col gap-2 text-sm">
            <label><input type="checkbox" /> 300+ reviews</label>
            <label><input type="checkbox" /> 200+ reviews</label>
            </div>
        </div>

        </div>

        {/* ===== RESORT LIST ===== */}
        <div className="flex-1 flex flex-col gap-6">
        {resorts.map((resort) => (
            <div
            key={resort.name}
            className="flex bg-white shadow rounded-2xl overflow-hidden"
            >

            {/* Card Area */}
            <div className="flex-1 cursor-pointer"
                onClick={() =>
                navigate(`/resort/${encodeURIComponent(resort.name)}`)
            }>
                <ResortCard resort={resort} />
            </div>

            {/* Check Availability Button */}
            <div className="w-72 border-l flex flex-col">

            {/* ===== TOP HALF — ROOMS ===== */}
            <div className="flex-1 p-6">
                <p className="font-semibold mb-2">Available Rooms</p>

                <div className="flex flex-wrap gap-2">
                {resort.rooms.map((room) => (
                <div key={room.id} className="relative group">

                    {/* TAG */}
                    <div className="flex items-center gap-2 bg-blue-100 px-2 py-1 rounded-2xl text-sm cursor-default">
                    {room.name}
                    </div>

                    {/* HOVER TOOLTIP */}
                    <div className="
                    absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                    bg-gray-600 text-white text-xs px-3 py-2 rounded-lg
                    opacity-0 group-hover:opacity-100
                    pointer-events-none
                    transition-opacity duration-200
                    whitespace-nowrap
                    z-50 
                    ">
                        {room.guests} Guests • {room.beds} Beds<br />
                        ₱ {room.price}
                    </div>

                </div>
                ))}
                </div>
            </div>

            {/* ===== BOTTOM HALF — PRICE + BUTTON ===== */}
            <div className="flex-1 p-6 flex flex-col justify-end">
                <p className="text-sm font-medium text-gray-600 mb-1">
                Average pricing per night
                </p>

                <p className="text-2xl font-bold text-blue-600 mb-4">
                ₱{resort.price.toLocaleString()}
                </p>

                <Button
                onClick={() =>
                    navigate(`/resort/${encodeURIComponent(resort.name)}`)
                }
                className="w-full rounded-xl text-lg hover:scale-105 transition-transform"
                >
                Check Availability
                </Button>
            </div>
            </div>
            </div>
        ))}
        </div>
    </div>
    </div>
    );
}
