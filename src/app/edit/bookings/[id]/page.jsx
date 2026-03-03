"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { resorts } from "@/components/data/resorts";
import { useResort } from "@/components/useclient/ContextEditor";
import { useBookings } from "@/components/useclient/BookingsClient";
import { 
  Plus, 
  Calendar as CalendarIcon, 
  ClipboardList, 
  LayoutDashboard,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Components
import BookingCalendar from "./components/BookingsCalendar";
import RentalManager from "./components/RentalManager";

export default function BookingManagementPage() {
  const { id } = useParams();
  const router = useRouter();
  const { resort, setResort, loadResort } = useResort();
  const { bookings } = useBookings();
  
  const [activeTab, setActiveTab] = useState("workflow"); // "workflow" | "calendar"

  useEffect(() => {
    if (id) loadResort(id, true);
  }, [id, loadResort]);

  const fallbackResort = useMemo(
    () => resorts.find((r) => r.id.toString() === id?.toString()),
    [id]
  );

  useEffect(() => {
    if (!resort && fallbackResort) setResort(fallbackResort);
  }, [resort, fallbackResort, setResort]);

  const currentResort = resort?.id?.toString() === id?.toString() ? resort : fallbackResort;

  const openForm = (guestData = {}, targetBookingId = null) => {
    if (targetBookingId) {
      router.push(`/edit/bookings/${id}/booking-details/${targetBookingId}/form`);
      return;
    }
    const payload = { ...guestData, resortName: currentResort?.name };
    const draftKey = `booking-form:${Date.now()}`;
    sessionStorage.setItem(draftKey, JSON.stringify(payload));
    router.push(`/edit/bookings/${id}/booking-details/new/form?draft=${encodeURIComponent(draftKey)}`);
  };

  const openDetails = (targetBookingId) => {
    router.push(`/edit/bookings/${id}/booking-details/${targetBookingId}`);
  };

  if (!currentResort) return <div className="p-20 text-center">Loading Management Console...</div>;

  return (
    <div className="mt-10 min-h-screen bg-slate-50">
      {/* Header Area */}
      <div className="max-w-[1600px] mx-auto pt-12 px-4 md:px-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
              <LayoutDashboard size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                Resort Manager <ChevronRight size={12}/> {currentResort.name}
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                Booking Console
              </h1>
            </div>
          </div>

          <Button 
            onClick={() => openForm({ status: "Inquiry" })}
            className="bg-blue-600 items-center justify-center hover:bg-blue-700 text-white rounded-2xl px-8 h-14 font-black shadow-lg shadow-blue-100 transition-all hover:scale-105 flex gap-3"
          >
            <Plus size={20} /> Create New Entry
          </Button>
        </header>

        {/* ADMIN STYLE TABS */}
        <div className="flex items-center gap-8 border-b border-slate-200 mb-8">
          <button
            onClick={() => setActiveTab("workflow")}
            className={`flex items-center gap-2 pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
              activeTab === "workflow" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <ClipboardList size={18} />
            Guest Workflow
            {activeTab === "workflow" && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full" />}
          </button>

          <button
            onClick={() => setActiveTab("calendar")}
            className={`flex items-center gap-2 pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
              activeTab === "calendar" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <CalendarIcon size={18} />
            Availability Calendar
            {activeTab === "calendar" && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full" />}
          </button>
        </div>

        {/* DYNAMIC CONTENT AREA */}
        <main className="pb-20">
          {activeTab === "workflow" ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <RentalManager onOpenForm={openForm} onOpenDetails={(item, id) => openDetails(id)} />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <BookingCalendar fullWidth />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}