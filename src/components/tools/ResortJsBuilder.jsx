import React, { useState } from "react";
import ResortResults from "../homepage/resort/ResortResults";
import HeroGallery from "../resortpages/HeroGallery";
import ShortcutBar from "../resortpages/ShortcutBar";
import ResortInfo from "../resortpages/ResortInfo";
import RoomsSection from "../resortpages/RoomsSection";

export default function ResortJsBuilder() {
  const [resort, setResort] = useState({
    name: "",
    location: "",
    price: 0,
    contactPhone: "",
    contactEmail: "",
    description: { summary: "" },
    image: "",
    gallery: [],
    facilities: [],
    rooms: [],
    tags: [],
  });

  const [newFacility, setNewFacility] = useState({ name: "", image: "" });
  const [newRoom, setNewRoom] = useState({ name: "", guests: 1, beds: "", price: 0, gallery: [], tags: [] });
  const [newRoomTag, setNewRoomTag] = useState("");
  const [newRoomGalleryItem, setNewRoomGalleryItem] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newGallery, setNewGallery] = useState("");

  const [showCardPreview, setShowCardPreview] = useState(true);
  const [showDetailPreview, setShowDetailPreview] = useState(true);

  // --- Functions ---
  const addFacility = () => {
    if (!newFacility.name) return;
    setResort({ ...resort, facilities: [...resort.facilities, newFacility] });
    setNewFacility({ name: "", image: "" });
  };

  const addRoom = () => {
    if (!newRoom.name) return;
    setResort({ ...resort, rooms: [...resort.rooms, { ...newRoom, id: Date.now() }] });
    setNewRoom({ name: "", guests: 1, beds: "", price: 0, gallery: [], tags: [] });
  };

  const addRoomTag = () => {
    if (!newRoomTag) return;
    setNewRoom({ ...newRoom, tags: [...newRoom.tags, newRoomTag] });
    setNewRoomTag("");
  };

  const moveRoomTag = (idx, dir) => {
    const tags = [...newRoom.tags];
    const [removed] = tags.splice(idx, 1);
    tags.splice(idx + dir, 0, removed);
    setNewRoom({ ...newRoom, tags });
  };

  const removeRoomTag = (idx) => {
    const tags = [...newRoom.tags];
    tags.splice(idx, 1);
    setNewRoom({ ...newRoom, tags });
  };

  const addRoomGalleryItem = () => {
    if (!newRoomGalleryItem) return;
    setNewRoom({ ...newRoom, gallery: [...newRoom.gallery, newRoomGalleryItem] });
    setNewRoomGalleryItem("");
  };

  const addTag = () => {
    if (!newTag) return;
    setResort({ ...resort, tags: [...resort.tags, newTag] });
    setNewTag("");
  };

  const moveTag = (fromIndex, toIndex) => {
    const tags = [...resort.tags];
    const [removed] = tags.splice(fromIndex, 1);
    tags.splice(toIndex, 0, removed);
    setResort({ ...resort, tags });
  };

  const addGallery = () => {
    if (!newGallery) return;
    setResort({ ...resort, gallery: [...resort.gallery, newGallery] });
    setNewGallery("");
  };

  // --- Generate JS output without quotes on keys ---
  const generateJsOutput = () => {
    const output = JSON.stringify([resort], null, 2)
      .replace(/"([^"]+)":/g, '$1:') // remove quotes around keys
      .replace(/\\"/g, '"'); // clean up escaped quotes
    return `export const resorts = [\n${output} \n];`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col gap-10 bg-gray-50">
      <h1 className="text-3xl font-bold text-center">Resort JS Builder</h1>

      {/* Basic Info */}
      <section className="bg-white p-4 rounded shadow space-y-3">
        <h2 className="font-semibold text-xl">Resort Info</h2>
        <label className="block">Resort Name</label>
        <input type="text" className="border px-3 py-2 w-full rounded" value={resort.name} onChange={(e) => setResort({ ...resort, name: e.target.value })} />
        <label className="block">Location</label>
        <input type="text" className="border px-3 py-2 w-full rounded" value={resort.location} onChange={(e) => setResort({ ...resort, location: e.target.value })} />
        <label className="block">Price</label>
        <input type="number" className="border px-3 py-2 w-full rounded" value={resort.price} onChange={(e) => setResort({ ...resort, price: Number(e.target.value) })} />
        <label className="block">Contact Phone</label>
        <input type="text" className="border px-3 py-2 w-full rounded" value={resort.contactPhone} onChange={(e) => setResort({ ...resort, contactPhone: e.target.value })} />
        <label className="block">Contact Email</label>
        <input type="text" className="border px-3 py-2 w-full rounded" value={resort.contactEmail} onChange={(e) => setResort({ ...resort, contactEmail: e.target.value })} />
        <label className="block">Short Summary</label>
        <textarea className="border px-3 py-2 w-full rounded" value={resort.description.summary} onChange={(e) => setResort({ ...resort, description: { summary: e.target.value } })} />
      </section>

      {/* Resort Tags */}
      <section className="bg-white p-4 rounded shadow space-y-3">
        <h2 className="font-semibold text-xl">Resort Tags</h2>
        <div className="flex flex-wrap gap-2">
          {resort.tags.map((tag, idx) => (
            <div key={idx} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {tag}
              {idx > 0 && <button onClick={() => moveTag(idx, idx - 1)}>↑</button>}
              {idx < resort.tags.length - 1 && <button onClick={() => moveTag(idx, idx + 1)}>↓</button>}
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <input type="text" placeholder="New Tag" className="border px-2 py-1 rounded flex-1" value={newTag} onChange={(e) => setNewTag(e.target.value)} />
          <button onClick={addTag} className="bg-blue-600 text-white px-4 py-1 rounded">Add Tag</button>
        </div>
      </section>

      {/* Rooms */}
      <section className="bg-white p-4 rounded shadow space-y-3">
        <h2 className="font-semibold text-xl">Rooms</h2>
        {resort.rooms.map((room) => (
          <div key={room.id} className="border p-3 rounded space-y-2 bg-gray-50">
            <div className="font-semibold text-lg">{room.name}</div>
            <div>Guests: {room.guests}, Beds: {room.beds}, Price: ₱{room.price}</div>
            <div className="flex gap-2 flex-wrap">
              {room.tags.map((tag, idx) => (
                <div key={idx} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {tag}
                </div>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap mt-2">
              {room.gallery.map((img, idx) => (
                <div key={idx} className="w-20 h-20 bg-gray-200 rounded overflow-hidden">
                  <img src={img} alt={`room-${room.name}-${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* New Room */}
        <div className="border p-4 rounded space-y-2 bg-gray-50">
          <label>Room Name</label>
          <input type="text" className="border px-2 py-1 w-full rounded" value={newRoom.name} onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })} />
          <label>Guests</label>
          <input type="number" className="border px-2 py-1 w-full rounded" value={newRoom.guests} onChange={(e) => setNewRoom({ ...newRoom, guests: Number(e.target.value) })} />
          <label>Beds</label>
          <input type="text" className="border px-2 py-1 w-full rounded" value={newRoom.beds} onChange={(e) => setNewRoom({ ...newRoom, beds: e.target.value })} />
          <label>Price</label>
          <input type="number" className="border px-2 py-1 w-full rounded" value={newRoom.price} onChange={(e) => setNewRoom({ ...newRoom, price: Number(e.target.value) })} />

          {/* Room Tags */}
          <div className="flex gap-2 mt-1">
            <input type="text" placeholder="Room Tag" className="border px-2 py-1 rounded flex-1" value={newRoomTag} onChange={(e) => setNewRoomTag(e.target.value)} />
            <button onClick={addRoomTag} className="bg-green-600 text-white px-4 py-1 rounded">Add Tag</button>
          </div>
          <div className="flex gap-2 flex-wrap mt-2">
            {newRoom.tags?.map((tag, idx) => (
              <div key={idx} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {tag}
                {idx > 0 && <button onClick={() => moveRoomTag(idx, -1)}>↑</button>}
                {idx < newRoom.tags.length - 1 && <button onClick={() => moveRoomTag(idx, 1)}>↓</button>}
                <button onClick={() => removeRoomTag(idx)}>✕</button>
              </div>
            ))}
          </div>

          {/* Room Gallery */}
          <div className="flex gap-2 mt-1">
            <input type="text" placeholder="Gallery Image URL" className="border px-2 py-1 rounded flex-1" value={newRoomGalleryItem} onChange={(e) => setNewRoomGalleryItem(e.target.value)} />
            <button onClick={addRoomGalleryItem} className="bg-blue-600 text-white px-4 py-1 rounded">Add Image</button>
          </div>
          <div className="flex gap-2 flex-wrap mt-2">
            {newRoom.gallery.map((img, idx) => (
              <div key={idx} className="w-20 h-20 bg-gray-200 rounded overflow-hidden">
                <img src={img} alt={`new-room-gallery-${idx}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          <button onClick={addRoom} className="bg-blue-700 text-white px-4 py-2 rounded mt-2 w-full">Add Room</button>
        </div>
      </section>

      {/* Resort Gallery */}
      <section className="bg-white p-4 rounded shadow space-y-3">
        <h2 className="font-semibold text-xl">Resort Gallery</h2>
        <div className="flex gap-2 flex-wrap">
          {resort.gallery.map((img, idx) => (
            <div key={idx} className="w-24 h-24 bg-gray-200 rounded overflow-hidden">
              <img src={img} alt={`resort-gallery-${idx}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <input type="text" placeholder="New Gallery Item URL" className="border px-2 py-1 rounded flex-1" value={newGallery} onChange={(e) => setNewGallery(e.target.value)} />
          <button onClick={addGallery} className="bg-blue-600 text-white px-4 py-1 rounded">Add Gallery</button>
        </div>
      </section>

      {/* Toggle Preview */}
      <div className="flex gap-4 justify-center">
        <button className="px-4 py-1 bg-gray-300 rounded" onClick={() => setShowCardPreview(!showCardPreview)}>
          {showCardPreview ? "Hide Card Preview" : "Show Card Preview"}
        </button>
        <button className="px-4 py-1 bg-gray-300 rounded" onClick={() => setShowDetailPreview(!showDetailPreview)}>
          {showDetailPreview ? "Hide Detail Preview" : "Show Detail Preview"}
        </button>
      </div>

      {/* JS Output */}
      <section className="bg-white p-4 rounded shadow space-y-3">
        <h2 className="font-semibold text-xl">Generated JS</h2>
        <textarea className="w-full border rounded p-2 h-64 font-mono text-xs" value={generateJsOutput()} readOnly />
      </section>

      {/* Preview */}
      <section className="space-y-6">
        {showCardPreview && (
          <div>
            <h2 className="font-semibold mb-2">ResortResults Preview</h2>
            <ResortResults resorts={[resort]} />
          </div>
        )}

        {showDetailPreview && (
          <div>
            <h2 className="font-semibold mb-2">ResortDetailPage Preview</h2>
            <div className="border p-4 rounded bg-white">
              <HeroGallery resort={resort} onOpen={() => {}} />
              <ShortcutBar />
              <ResortInfo resort={resort} onFacilityOpen={() => {}} />
              <RoomsSection resort={resort} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
