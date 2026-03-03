"use client";

import React, { useMemo, useState } from "react";
import { Inbox, CheckCircle2, AlertCircle, Mail, User, FileText, ChevronRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookings } from "@/components/useclient/BookingsClient";
import { useResort } from "@/components/useclient/ContextEditor";

const TABS = [
  { id: "inbox", label: "Inbox", icon: Inbox, color: "text-blue-600", bg: "bg-blue-50" },
  { id: "confirmed", label: "Confirmed", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  { id: "overdue", label: "Action Needed", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
];

export default function RentalManager({ onOpenForm, onOpenDetails }) {
  const [activeTab, setActiveTab] = useState("inbox");
  const { bookings } = useBookings();
  const { resort } = useResort();

  const rows = useMemo(() => {
    return (bookings || []).map((booking) => {
      const form = booking.bookingForm || {};
      const roomId = booking.roomIds?.[0];
      const roomName = resort?.rooms?.find((r) => r.id === roomId)?.name || form.roomName || "Room";
      return {
        bookingId: booking.id,
        guestName: form.guestName || "Guest",
        room: roomName,
        email: form.email || "No email",
        status: (form.status || booking.status || "Inquiry").toLowerCase(),
        checkInDate: booking.startDate || form.checkInDate || "",
        checkOutDate: booking.endDate || form.checkOutDate || "",
      };
    });
  }, [bookings, resort?.rooms]);

  const grouped = useMemo(() => ({
    inbox: rows.filter((r) => r.status.includes("inquiry") || r.status.includes("pending")),
    confirmed: rows.filter((r) => r.status.includes("confirm")),
    overdue: rows.filter((r) => r.status.includes("checkout") || r.status.includes("overdue") || r.status.includes("decline")),
  }), [rows]);

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex p-2 bg-slate-50/50 border-b border-slate-50">
        {TABS.map((tab) => {
          const count = grouped[tab.id].length;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                isActive ? "bg-white text-slate-900 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <tab.icon size={16} className={isActive ? tab.color : ""} />
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${isActive ? `${tab.bg} ${tab.color}` : "bg-slate-200 text-slate-500"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="p-6 space-y-3">
        {grouped[activeTab].length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-4">
            <div className="p-4 bg-slate-50 rounded-full text-slate-200"><Inbox size={40}/></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Queue is empty</p>
          </div>
        ) : (
          grouped[activeTab].map((item) => (
            <div
              key={item.bookingId}
              className="group flex flex-col md:flex-row items-center justify-between p-4 rounded-2xl border border-slate-50 bg-white hover:border-blue-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <User size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-900">{item.guestName}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 rounded-md text-slate-500 uppercase tracking-tighter">{item.room}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                     <p className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1">
                       {item.checkInDate} <ChevronRight size={10}/> {item.checkOutDate}
                     </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <Button 
                  variant="ghost" 
                  className="items-center justify-center rounded-xl font-bold text-xs h-10 hover:bg-slate-50 flex gap-2"
                  onClick={() => onOpenDetails(item, item.bookingId)}
                >
                  Manage <ArrowUpRight size={14}/>
                </Button>
                <Button 
                  className="rounded-xl bg-blue-600 items-center justify-center hover:bg-blue-700 h-10 px-6 font-bold text-xs flex gap-2"
                  onClick={() => onOpenForm(item, item.bookingId)}
                >
                  <FileText size={14} /> Full Form
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}