import React, { useState } from "react";
import { Users } from "lucide-react";

export default function GuestField({
  guestType,
  setGuestType,
  rooms,
  setRooms,
  adults,
  setAdults,
  children,
  setChildren,
  activeDropdown,
  setActiveDropdown,
  handleGuestTypeChange
}) {

  const [showSidePanel, setShowSidePanel] = useState(false);

  function onGuestTypeSelect(type) {
    handleGuestTypeChange(type);
    setGuestType(type);

    if (type === "Family" || type === "Group") {
      setShowSidePanel(true);
    } else {
      setShowSidePanel(false);
    }
  }

  return (
<div className="relative flex items-center gap-2 border rounded-xl px-3 py-2 flex-1">
  <Users size={16} />

  <button
    className="flex-1 flex justify-between items-center text-left"
    onClick={() =>
      setActiveDropdown(activeDropdown === "guests" ? null : "guests")
    }
  >
    <div className="flex flex-col">
      <span className="text-sm font-medium whitespace-nowrap">
        {adults} Adults
        {children > 0 && `, ${children} Child${children > 1 ? "ren" : ""}`}
      </span>
      <span className="text-xs text-gray-500">Room {rooms}</span>
    </div>
    <span className="text-gray-500 text-sm">▼</span>
  </button>

  {activeDropdown === "guests" && (
    <div
      className={`absolute top-full left-0 bg-white shadow-xl rounded-xl mt-2 p-4 z-[9999]
      ${
        guestType === "Family" || guestType === "Group"
          ? "w-96"
          : "w-64"
      } transition-all duration-300`}
    >
      <div
        className={`grid gap-4 ${
          guestType === "Family" || guestType === "Group"
            ? "grid-cols-2"
            : "grid-cols-1"
        }`}
      >
        {/* Guest Types */}
        <div className="flex flex-col gap-2">
          {["Solo Traveler", "Couple", "Family", "Group"].map((type) => (
            <button
              key={type}
              className={`text-left relative p-2 rounded-md hover:bg-blue-100 text-sm ${
                guestType === type ? "bg-blue-50 font-medium" : ""
              }`}
              onClick={() => handleGuestTypeChange(type)}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Family / Group Controls */}
        {(guestType === "Family" || guestType === "Group") && (
          <div className="flex flex-col gap-3 text-sm">
            {/* Rooms */}
            <div className="flex justify-between items-center">
              <span>Rooms</span>
              <div className="flex items-center gap-2">
                <button
                  className="px-2 py-1 bg-gray-100 rounded"
                  onClick={() => setRooms(Math.max(1, rooms - 1))}
                >
                  -
                </button>
                <span className="w-6 text-center">{rooms}</span>
                <button
                  className="px-2 py-1 bg-gray-100 rounded"
                  onClick={() => setRooms(rooms + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Adults */}
            <div className="flex justify-between items-center">
              <span>Adults</span>
              <div className="flex items-center gap-2">
                <button
                  className="px-2 py-1 bg-gray-100 rounded"
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                >
                  -
                </button>
                <span className="w-6 text-center">{adults}</span>
                <button
                  className="px-2 py-1 bg-gray-100 rounded"
                  onClick={() => setAdults(adults + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Children */}
            <div className="flex justify-between items-center">
              <span>Children</span>
              <div className="flex items-center gap-2">
                <button
                  className="px-2 py-1 bg-gray-100 rounded"
                  onClick={() => setChildren(Math.max(0, children - 1))}
                >
                  -
                </button>
                <span className="w-6 text-center">{children}</span>
                <button
                  className="px-2 py-1 bg-gray-100 rounded"
                  onClick={() => setChildren(children + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )}
</div>
  );
}
