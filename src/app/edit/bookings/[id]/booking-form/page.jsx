"use client";

import React, { useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { resorts } from "@/components/data/resorts";
import { useResort } from "@/components/useclient/ContextEditor";
import BookingForm from "../components/BookingConfirmation";

const GROUP_COLORS = ["bg-blue-600", "bg-emerald-600", "bg-amber-500", "bg-rose-500", "bg-violet-600", "bg-cyan-500"];

export default function BookingFormPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resort, updateResort } = useResort();

  const resortId = params?.id;
  const bookingId = searchParams.get("bookingId");
  const draftKey = searchParams.get("draft");

  const fallbackResort = useMemo(
    () => resorts.find((r) => r.id.toString() === resortId?.toString()),
    [resortId]
  );

  const currentResort = resort?.id?.toString() === resortId?.toString() ? resort : fallbackResort;
  const bookings = currentResort?.bookings || [];

  let draftData = null;
  if (typeof window !== "undefined" && draftKey) {
    const raw = sessionStorage.getItem(draftKey);
    if (raw) {
      try {
        draftData = JSON.parse(raw);
      } catch {
        draftData = null;
      }
    }
  }

  const existingBooking = bookingId ? bookings.find((b) => b.id.toString() === bookingId.toString()) : null;

  const initialData = {
    ...(draftData || {}),
    ...(existingBooking?.bookingForm || {}),
    checkInDate: existingBooking?.startDate || draftData?.checkInDate || "",
    checkOutDate: existingBooking?.endDate || draftData?.checkOutDate || "",
    checkInTime: existingBooking?.checkInTime || draftData?.checkInTime || "14:00",
    checkOutTime: existingBooking?.checkOutTime || draftData?.checkOutTime || "11:00",
    resortName: currentResort?.name,
  };

  const handleSave = (formData) => {
    const currentBookings = currentResort?.bookings || [];

    if (bookingId) {
      const updated = currentBookings.map((booking) => {
        if (booking.id.toString() !== bookingId.toString()) return booking;
        return {
          ...booking,
          startDate: formData.checkInDate || booking.startDate,
          endDate: formData.checkOutDate || booking.endDate,
          checkInTime: formData.checkInTime || booking.checkInTime,
          checkOutTime: formData.checkOutTime || booking.checkOutTime,
          bookingForm: formData,
        };
      });
      updateResort("bookings", updated);
      router.push(`/edit/bookings/${resortId}/booking-details/${bookingId}`);
      return;
    }

    const newBookingId = Date.now();
    const nextBooking = {
      id: newBookingId,
      roomIds: currentResort?.rooms?.[0]?.id ? [currentResort.rooms[0].id] : [],
      startDate: formData.checkInDate || null,
      endDate: formData.checkOutDate || null,
      checkInTime: formData.checkInTime || "14:00",
      checkOutTime: formData.checkOutTime || "11:00",
      colorClass: GROUP_COLORS[currentBookings.length % GROUP_COLORS.length],
      bookingForm: formData,
    };

    updateResort("bookings", [...currentBookings, nextBooking]);
    router.push(`/edit/bookings/${resortId}/booking-details/${newBookingId}`);
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <BookingForm
        title={bookingId ? "Edit Booking Form" : "New Booking Form"}
        data={initialData}
        resortName={currentResort?.name}
        onCancel={() => router.back()}
        onSave={handleSave}
      />
    </div>
  );
}
