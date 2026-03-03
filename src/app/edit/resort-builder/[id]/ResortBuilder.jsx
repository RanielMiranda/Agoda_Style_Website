"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Save, CheckCircle, Loader2, ChevronLeft, Trash2, Mail, User, Calendar, CreditCard, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResort } from "@/components/useclient/ContextEditor";
import { useBookings } from "@/components/useclient/BookingsClient";
import { resorts } from "@/components/data/resorts";

const DEFAULT_FORM = {
  status: "Inquiry", guestName: "", email: "", checkInDate: "", checkInTime: "14:00",
  checkOutDate: "", checkOutTime: "11:00", guestCount: 0, roomCount: 1,
  totalAmount: 0, downpayment: 0, paymentMethod: "Pending", notes: "",
};

export default function BookingDetailsPage() {
  const { id, bookingId } = useParams();
  const router = useRouter();
  const { resort } = useResort();
  const { bookings, updateBookingById, deleteBookingById } = useBookings();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const fallbackResort = useMemo(() => resorts.find((e) => e.id.toString() === id?.toString()), [id]);
  const currentResort = resort?.id?.toString() === id?.toString() ? resort : fallbackResort;
  const booking = (bookings || currentResort?.bookings || []).find((b) => b.id.toString() === bookingId?.toString());

  const [draft, setDraft] = useState(() => normalizeBooking(booking));

  if (!booking) return <div className="p-20 text-center text-slate-500">Booking not found.</div>;

  const handleFieldChange = (field, value) => setDraft((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    updateBookingById(bookingId, (entry) => ({
      ...entry,
      startDate: draft.checkInDate || entry.startDate,
      endDate: draft.checkOutDate || entry.endDate,
      checkInTime: draft.checkInTime || entry.checkInTime,
      checkOutTime: draft.checkOutTime || entry.checkOutTime,
      bookingForm: draft,
      status: draft.status || entry.status,
    }));
    setIsSaved(true);
    setIsEditing(false);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const updateStatus = (nextStatus) => {
    const next = { ...draft, status: nextStatus };
    setDraft(next);
    handleSave();
  };

  return (
    <div className="min-h-screen bg-white pb-32 pt-20">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b pb-8 border-slate-100">
          <div>
            <button 
              onClick={() => router.push(`/edit/bookings/${id}`)}
              className="flex items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors text-xs font-bold uppercase tracking-widest mb-4"
            >
              <ChevronLeft size={14} /> Back to Calendar
            </button>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              {draft.guestName || "New Inquiry"}
            </h1>
            <p className="text-blue-600 font-bold mt-1">{currentResort?.name} • {getRoomName(booking, currentResort)}</p>
          </div>
          
          <div className="mt-6 md:mt-0 flex flex-col items-end gap-3">
             <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyle(draft.status)}`}>
                {draft.status}
             </div>
             <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => updateStatus("Confirmed")} className="h-8 text-[10px] font-bold uppercase">Approve</Button>
                <Button variant="outline" size="sm" onClick={() => updateStatus("Declined")} className="h-8 text-[10px] font-bold uppercase text-red-600">Decline</Button>
             </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-16">
          
          {/* Section: Guest Information */}
          <section>
            <SectionHeader icon={<User size={18}/>} title="Guest Profile" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <EditableField label="Full Name" value={draft.guestName} editing={isEditing} onChange={(v) => handleFieldChange("guestName", v)} />
              <EditableField label="Email Address" value={draft.email} editing={isEditing} onChange={(v) => handleFieldChange("email", v)} />
              <EditableField label="Phone Number" value={draft.phoneNumber} editing={isEditing} onChange={(v) => handleFieldChange("phoneNumber", v)} />
              <EditableField label="Guest Count" type="number" value={String(draft.guestCount)} editing={isEditing} onChange={(v) => handleFieldChange("guestCount", Number(v))} />
            </div>
          </section>

          {/* Section: Stay Details */}
          <section>
            <SectionHeader icon={<Calendar size={18}/>} title="Stay Schedule" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <EditableField label="Check-In Date" type="date" value={toDateValue(draft.checkInDate)} editing={isEditing} onChange={(v) => handleFieldChange("checkInDate", v)} />
              <EditableField label="Check-In Time" type="time" value={draft.checkInTime} editing={isEditing} onChange={(v) => handleFieldChange("checkInTime", v)} />
              <EditableField label="Check-Out Date" type="date" value={toDateValue(draft.checkOutDate)} editing={isEditing} onChange={(v) => handleFieldChange("checkOutDate", v)} />
              <EditableField label="Check-Out Time" type="time" value={draft.checkOutTime} editing={isEditing} onChange={(v) => handleFieldChange("checkOutTime", v)} />
            </div>
          </section>

          {/* Section: Financials */}
          <section>
            <SectionHeader icon={<CreditCard size={18}/>} title="Payment & Rates" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <EditableField label="Total Amount" type="number" prefix="₱" value={String(draft.totalAmount)} editing={isEditing} onChange={(v) => handleFieldChange("totalAmount", Number(v))} />
              <EditableField label="Downpayment" type="number" prefix="₱" value={String(draft.downpayment)} editing={isEditing} onChange={(v) => handleFieldChange("downpayment", Number(v))} />
              <EditableField label="Method" value={draft.paymentMethod} editing={isEditing} onChange={(v) => handleFieldChange("paymentMethod", v)} />
            </div>
          </section>

          {/* Section: Notes */}
          <section>
            <SectionHeader icon={<FileText size={18}/>} title="Additional Notes" />
            <EditableTextArea value={draft.notes} editing={isEditing} onChange={(v) => handleFieldChange("notes", v)} />
          </section>

          <div className="pt-10 border-t border-slate-50 flex justify-center">
            <button 
              onClick={() => { if(confirm("Delete this booking?")) { deleteBookingById(bookingId); router.push(`/edit/bookings/${id}`); }}}
              className="text-red-400 hover:text-red-600 text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <Trash2 size={14} /> Delete Booking Record
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3">
        {!isEditing && (
            <Button 
                onClick={() => setIsEditing(true)} 
                variant="outline" 
                className="bg-white shadow-xl rounded-full px-6 hover:bg-slate-50 border-slate-200"
            >
                Edit Mode
            </Button>
        )}

        <Button
          onClick={handleSave}
          className={`flex items-center gap-2 px-8 py-6 shadow-2xl rounded-full transition-all active:scale-95 ${
            isSaved ? "bg-emerald-600" : "bg-slate-900 hover:bg-black"
          }`}
        >
          {isSaved ? (
            <><CheckCircle size={20} /> <span>Changes Saved</span></>
          ) : (
            <><Save size={20} /> <span>{isEditing ? "Apply Changes" : "Quick Save"}</span></>
          )}
        </Button>
      </div>
    </div>
  );
}

/* Helper Components */

function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="p-2 bg-slate-50 rounded-lg text-slate-400">{icon}</div>
      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{title}</h3>
    </div>
  );
}

function EditableField({ label, value, editing, onChange, type = "text", prefix }) {
  return (
    <div className="group">
      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">{label}</p>
      {editing ? (
        <div className="relative">
          {prefix && <span className="absolute left-3 top-2 text-slate-400 text-sm">{prefix}</span>}
          <input
            type={type}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl px-4 py-2 text-sm font-bold transition-all outline-none border-2 ${prefix ? 'pl-7' : ''}`}
          />
        </div>
      ) : (
        <p className="text-base font-bold text-slate-900 px-1 border-b-2 border-transparent">
          {prefix}{value || "—"}
        </p>
      )}
    </div>
  );
}

function EditableTextArea({ value, editing, onChange }) {
  return (
    editing ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Add special requests or stay details..."
        className="w-full min-h-[120px] bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl p-4 text-sm font-medium transition-all outline-none"
      />
    ) : (
      <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-6 rounded-2xl italic">
        {value || "No additional notes provided."}
      </p>
    )
  );
}

/* Logic Helpers same as your original code... */
function getStatusStyle(status) {
  const s = (status || "").toLowerCase();
  if (s.includes("confirm")) return "bg-emerald-50 text-emerald-600";
  if (s.includes("pending") || s.includes("inquiry")) return "bg-blue-50 text-blue-600";
  if (s.includes("declin")) return "bg-rose-50 text-rose-600";
  return "bg-slate-50 text-slate-600";
}

function getRoomName(booking, resort) {
  if (!booking?.roomIds?.length) return "N/A";
  const room = resort?.rooms?.find((entry) => entry.id === booking.roomIds[0]);
  return room?.name || "Multiple Rooms";
}

function toDateValue(value) {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toISOString().slice(0, 10);
}

function normalizeBooking(booking) {
  const form = booking?.bookingForm || {};
  return {
    ...DEFAULT_FORM,
    ...form,
    checkInDate: form.checkInDate || booking?.startDate || "",
    checkOutDate: form.checkOutDate || booking?.endDate || "",
    checkInTime: form.checkInTime || booking?.checkInTime || "14:00",
    checkOutTime: form.checkOutTime || booking?.checkOutTime || "11:00",
    status: booking?.status || form.status || "Inquiry"
  };
}