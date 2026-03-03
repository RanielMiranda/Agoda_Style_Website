"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { resorts } from "@/components/data/resorts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useResort } from "@/components/useclient/ContextEditor";
import BookingForm from "../../components/BookingConfirmation";

export default function BookingDetailsPage() {
  const { id, bookingId } = useParams();
  const router = useRouter();
  const { resort, updateResort } = useResort();

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fallbackResort = useMemo(
    () => resorts.find((entry) => entry.id.toString() === id?.toString()),
    [id]
  );

  const currentResort = resort?.id?.toString() === id?.toString() ? resort : fallbackResort;
  const booking = (currentResort?.bookings || []).find((b) => b.id.toString() === bookingId?.toString());

  if (!booking) {
    return (
      <div className="p-10 text-center">
        <p className="text-slate-500">Booking range not found.</p>
        <Button className="mt-4" onClick={() => router.push(`/edit/bookings/${id}`)}>
          Back to Booking Page
        </Button>
      </div>
    );
  }

  const formData = {
    ...(booking.bookingForm || {}),
    checkInDate: booking.startDate || booking.bookingForm?.checkInDate,
    checkOutDate: booking.endDate || booking.bookingForm?.checkOutDate,
    checkInTime: booking.checkInTime || booking.bookingForm?.checkInTime,
    checkOutTime: booking.checkOutTime || booking.bookingForm?.checkOutTime,
  };

  const handleSave = (updatedForm) => {
    const updatedBookings = (currentResort?.bookings || []).map((entry) => {
      if (entry.id.toString() !== bookingId.toString()) return entry;
      return {
        ...entry,
        startDate: updatedForm.checkInDate || entry.startDate,
        endDate: updatedForm.checkOutDate || entry.endDate,
        checkInTime: updatedForm.checkInTime || entry.checkInTime,
        checkOutTime: updatedForm.checkOutTime || entry.checkOutTime,
        bookingForm: updatedForm,
      };
    });

    updateResort("bookings", updatedBookings);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 mt-[9vh]">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">Booking Details</h1>
            <p className="text-sm text-blue-600 font-bold">{currentResort?.name}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/edit/bookings/${id}`)}>
              Back
            </Button>
            <Button onClick={() => setShowForm((prev) => !prev)}>
              {showForm ? "Hide Form" : "View Form"}
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsEditing(true)}>
              Edit Details
            </Button>
          </div>
        </div>

        <Card className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Info label="Guest" value={formData.guestName || "No guest yet"} />
          <Info label="Rooms" value={`${booking.roomIds?.length || 0} selected`} />
          <Info label="Check-In" value={`${booking.startDate || "-"} ${booking.checkInTime || ""}`} />
          <Info label="Check-Out" value={`${booking.endDate || "-"} ${booking.checkOutTime || ""}`} />
        </Card>

        {showForm && (
          <BookingForm
            title="Booking Form"
            data={formData}
            resortName={currentResort?.name}
            readOnly={!isEditing}
            onCancel={() => setIsEditing(false)}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="text-sm font-bold text-slate-800 mt-1">{value}</p>
    </div>
  );
}
