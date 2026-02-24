"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { BUCKET_NAME } from "@/lib/utils";

const ResortContext = createContext();

export const ResortProvider = ({ children }) => {
  const [resort, setResort] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Persistence: Load draft from LocalStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("resort_builder_draft");
    if (savedDraft && !resort) {
      try {
        setResort(JSON.parse(savedDraft));
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }
  }, []);

  // 2. Persistence: Save to LocalStorage whenever state changes
  useEffect(() => {
    if (resort) {
      // Note: File objects cannot be stringified; they will be lost on refresh
      // but string URLs (previews) and text data will persist.
      localStorage.setItem("resort_builder_draft", JSON.stringify(resort));
    }
  }, [resort]);

  const loadResort = async (identifier, isId = true) => {
    setLoading(true);
    const column = isId ? "id" : "name";
    try {
      const { data, error } = await supabase.from("resorts").select("*").eq(column, identifier).single();
      if (error) throw error;
      setResort(data);
    } catch (err) {
      console.error("Error loading:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file, category, subFolder = "") => {
    if (!resort?.name) return null;
    const safeResortName = resort.name.replace(/\s+/g, "-").toLowerCase();
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    let path = `${safeResortName}/${category}`;
    if (subFolder) path += `/${subFolder.replace(/\s+/g, "-").toLowerCase()}`;
    path += `/${fileName}`;

    const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(path, file);
    if (error) throw error;
    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
    return urlData.publicUrl;
  };

  const saveResort = async () => {
    if (!resort) return;
    setLoading(true);
    try {
      // Process Hero Gallery
      const updatedGallery = await Promise.all(
        (resort.gallery || []).map(async (item) => 
          item instanceof File ? await uploadImage(item, "hero") : item
        )
      );

      // Process Amenities (Facilities)
      const updatedFacilities = await Promise.all(
        (resort.facilities || []).map(async (f) => ({
          ...f,
          image: f.image instanceof File ? await uploadImage(f.image, "facilities") : f.image
        }))
      );

      // Process Rooms
      const updatedRooms = await Promise.all(
        (resort.rooms || []).map(async (room) => ({
          ...room,
          gallery: await Promise.all(
            (room.gallery || []).map(async (img) => 
              img instanceof File ? await uploadImage(img, "rooms", room.name) : img
            )
          )
        }))
      );

      const finalPayload = {
        ...resort,
        gallery: updatedGallery,
        facilities: updatedFacilities,
        rooms: updatedRooms
      };

      const { error } = await supabase.from("resorts").upsert(finalPayload);
      if (error) throw error;

      setResort(finalPayload);
      localStorage.removeItem("resort_builder_draft"); // Clear draft on success
      return true;
    } catch (err) {
      alert("Error saving: " + err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateResort = (field, value) => setResort(prev => ({ ...prev, [field]: value }));
  const safeSrc = (src) => (src instanceof File ? URL.createObjectURL(src) : src);

  return (
    <ResortContext.Provider value={{ resort, setResort, loading, loadResort, saveResort, updateResort, safeSrc }}>
      {children}
    </ResortContext.Provider>
  );
};

export const useResort = () => useContext(ResortContext);