"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { getCheckoutMismatchMessage, isCheckoutAmountSettled } from "@/lib/bookingPayments";

const DEFAULT_FORM = {
  status: "Inquiry",
  guestName: "",
  address: "",
  email: "",
  phoneNumber: "",
  adultCount: 0,
  childrenCount: 0,
  guestCount: 0,
  roomCount: 1,
  roomName: "",
  sleepingGuests: 0,
  baseRate: 0,
  checkInDate: "",
  checkInTime: "14:00",
  checkOutDate: "",
  checkOutTime: "11:00",
  bookingAgent: "Direct",
  turnoverAuthorizedPerson: "",
  paymentMethod: "Pending",
  paymentDeadline: "",
  confirmationStub: null,
  downpayment: 0,
  totalAmount: 0,
  resortServices: [],
  notes: "",
};

export default function BookingConfirmation({
  data,
  resortName,
  resortProfileImage,
  resortPrice = 0,
  resortServices = [],
  readOnly = false,
  onSave,
  storageKey,
}) {
  const [formData, setFormData] = useState(() => {
    if (typeof window !== "undefined" && storageKey) {
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) return { ...DEFAULT_FORM, ...(data || {}), ...JSON.parse(raw) };
      } catch {
        // ignore draft parse errors
      }
    }
    return { ...DEFAULT_FORM, ...(data || {}) };
  });

  const selectedServices = Array.isArray(formData.resortServices) && formData.resortServices.length > 0
    ? formData.resortServices
    : Array.isArray(resortServices)
      ? resortServices
      : [];
  const serviceTotal = useMemo(
    () =>
      (selectedServices || []).reduce(
        (sum, entry) => sum + Number(entry?.cost || 0),
        0
      ),
    [selectedServices]
  );
  const resortRental = Number(resortPrice || 0);
  const computedTotal =
    Number(formData.totalAmount || 0) > 0
      ? Number(formData.totalAmount || 0)
      : resortRental + serviceTotal;
  const balanceDue = useMemo(
    () => Math.max(0, computedTotal - Number(formData.downpayment || 0)),
    [computedTotal, formData.downpayment]
  );

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNumberChange = (field, value) => {
    const parsed = Number(value);
    const nextValue = Number.isNaN(parsed) ? 0 : parsed;
    if (field === "adultCount" || field === "childrenCount") {
      setFormData((prev) => {
        const next = { ...prev, [field]: nextValue };
        const pax = Number(next.adultCount || 0) + Number(next.childrenCount || 0);
        return { ...next, guestCount: pax, pax };
      });
      return;
    }
    handleChange(field, nextValue);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (readOnly || !onSave) return;

    const sameDay =
      formData.checkInDate &&
      formData.checkOutDate &&
      formData.checkInDate === formData.checkOutDate;
    if (sameDay && formData.checkInTime && formData.checkOutTime && formData.checkOutTime <= formData.checkInTime) {
      alert("For same-day bookings, check-out time must be later than check-in time.");
      return;
    }
    if (formData.status === "Checked Out") {
      const isSettled = isCheckoutAmountSettled({
        totalAmount: formData.totalAmount,
        paidAmount: formData.downpayment,
      });
      if (!isSettled) {
        alert(
          getCheckoutMismatchMessage({
            totalAmount: formData.totalAmount,
            paidAmount: formData.downpayment,
          })
        );
        return;
      }
      const confirmed = window.confirm("Confirm checkout for this booking?");
      if (!confirmed) return;
    }

    if (storageKey && typeof window !== "undefined") {
      localStorage.removeItem(storageKey);
    }
    onSave(formData);
  };

  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    const timer = setTimeout(() => {
      localStorage.setItem(storageKey, JSON.stringify(formData));
    }, 200);
    return () => clearTimeout(timer);
  }, [formData, storageKey]);

  const inputClass =
    "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500";
  const formId = "booking-form";

  const resortInitials = (resortName || "Resort")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div className="max-w-[210mm] min-h-[297mm] mx-auto mt-10 mb-28 bg-white shadow-2xl border border-slate-200 rounded-[18px] px-10 py-12 docx-sheet">
      <div className="flex flex-col items-center text-center border-b border-slate-200 pb-6 gap-3">
        {resortProfileImage ? (
          <img
            src={resortProfileImage}
            alt={`${resortName || "Resort"} logo`}
            className="h-16 w-16 rounded-full object-cover shadow-md border border-slate-200"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-black shadow-md">
            {resortInitials || "R"}
          </div>
        )}
        <div className="space-y-1">
          <p className="text-sm text-slate-500">{resortName || "Resort"}</p>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
            Confirmation booking form
          </h1>
        </div>
      </div>
    
      <form onSubmit={handleSubmit} id={formId}>
        <div className="space-y-8">
          <section className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">Guest Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Guest Name"><input disabled={readOnly} className={inputClass} value={formData.guestName} onChange={(e) => handleChange("guestName", e.target.value)} /></Field>
              <Field label="Email"><input disabled={readOnly} className={inputClass} type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} /></Field>
              <Field label="Phone Number"><input disabled={readOnly} className={inputClass} value={formData.phoneNumber} onChange={(e) => handleChange("phoneNumber", e.target.value)} /></Field>
              <Field label="Address"><input disabled={readOnly} className={inputClass} value={formData.address} onChange={(e) => handleChange("address", e.target.value)} /></Field>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">Stay & Booking Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {readOnly ? (
                <>
                  <Field label="Check-In Date">
                    <div className="text-sm font-bold text-slate-700">{formatLongDate(formData.checkInDate)}</div>
                  </Field>
                  <Field label="Check-In Time">
                    <div className="text-sm font-bold text-slate-700">{formData.checkInTime || "--:--"}</div>
                  </Field>
                  <Field label="Check-Out Date">
                    <div className="text-sm font-bold text-slate-700">{formatLongDate(formData.checkOutDate)}</div>
                  </Field>
                  <Field label="Check-Out Time">
                    <div className="text-sm font-bold text-slate-700">{formData.checkOutTime || "--:--"}</div>
                  </Field>
                </>
              ) : (
                <>
                  <Field label="Check-In Date"><input disabled={readOnly} className={inputClass} type="date" value={toDateValue(formData.checkInDate)} onChange={(e) => handleChange("checkInDate", e.target.value)} /></Field>
                  <Field label="Check-In Time"><input disabled={readOnly} className={inputClass} type="time" value={formData.checkInTime || ""} onChange={(e) => handleChange("checkInTime", e.target.value)} /></Field>
                  <Field label="Check-Out Date"><input disabled={readOnly} className={inputClass} type="date" value={toDateValue(formData.checkOutDate)} onChange={(e) => handleChange("checkOutDate", e.target.value)} /></Field>
                  <Field label="Check-Out Time"><input disabled={readOnly} className={inputClass} type="time" value={formData.checkOutTime || ""} onChange={(e) => handleChange("checkOutTime", e.target.value)} /></Field>
                </>
              )}
              <Field label="Adults"><input disabled={readOnly} className={inputClass} type="number" min="0" value={formData.adultCount} onChange={(e) => handleNumberChange("adultCount", e.target.value)} /></Field>
              <Field label="Children"><input disabled={readOnly} className={inputClass} type="number" min="0" value={formData.childrenCount} onChange={(e) => handleNumberChange("childrenCount", e.target.value)} /></Field>
              <Field label="Guests"><input disabled={readOnly} className={inputClass} type="number" min="0" value={formData.guestCount} onChange={(e) => handleNumberChange("guestCount", e.target.value)} /></Field>
              <Field label="Sleeping Guests"><input disabled={readOnly} className={inputClass} type="number" min="0" value={formData.sleepingGuests} onChange={(e) => handleNumberChange("sleepingGuests", e.target.value)} /></Field>
              <Field label="Room">
                {readOnly ? (
                  <div className="text-sm font-bold text-slate-700">
                    {formData.roomName || "-"}
                  </div>
                ) : (
                  <input
                    disabled={readOnly}
                    className={inputClass}
                    value={formData.roomName || ""}
                    onChange={(e) => handleChange("roomName", e.target.value)}
                    placeholder="Room A, Room B"
                  />
                )}
              </Field>
            </div>
          </section>
          <section className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">Payment Summary</h2>
            <div className="space-y-4 text-sm text-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">Total Amount Due</p>
                  <div className="flex items-center justify-between">
                    <span>Resort rental</span>
                    <span className="font-bold">PHP {resortRental.toLocaleString()}</span>
                  </div>
                  {(selectedServices || []).length > 0 ? (
                    selectedServices.map((service, index) => (
                      <div key={`${service?.name || "service"}-${index}`} className="flex items-center justify-between">
                        <span>{service?.name || "Service"}</span>
                        <span className="font-bold">PHP {Number(service?.cost || 0).toLocaleString()}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-between">
                      <span>Services</span>
                      <span className="font-bold">PHP 0</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">Payment Details</p>
                  <div className="flex items-center justify-between">
                    <span>Downpayment</span>
                    <span className="font-bold">PHP {Number(formData.downpayment || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Payment channel</span>
                    <span className="font-bold">{formData.paymentMethod || "Pending"}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                <span className="font-bold">Total due</span>
                <span className="font-black">PHP {computedTotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold">Total balance</span>
                <span className="font-black">PHP {balanceDue.toLocaleString()}</span>
              </div>
            </div>
            {!readOnly ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Field label="Base Rate"><input disabled={readOnly} className={inputClass} type="number" min="0" value={formData.baseRate} onChange={(e) => handleNumberChange("baseRate", e.target.value)} /></Field>
                <Field label="Payment Method">
                  <select disabled={readOnly} className={inputClass} value={formData.paymentMethod || "Pending"} onChange={(e) => handleChange("paymentMethod", e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="GCash">GCash</option>
                    <option value="Bank">Bank</option>
                    <option value="Cash">Cash</option>
                  </select>
                </Field>
                <Field label="Total Amount"><input disabled={readOnly} className={inputClass} type="number" min="0" value={formData.totalAmount} onChange={(e) => handleNumberChange("totalAmount", e.target.value)} /></Field>
                <Field label="Downpayment"><input disabled={readOnly} className={inputClass} type="number" min="0" value={formData.downpayment} onChange={(e) => handleNumberChange("downpayment", e.target.value)} /></Field>
              </div>
            ) : null}
          </section>

          <section className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">Notes</h2>
            <textarea
              disabled={readOnly}
              className={`${inputClass} min-h-24`}
              value={formData.notes || ""}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Special requests, payment remarks, or internal notes"
            />
          </section>

        </div>
      </form>
      <div className="fixed bottom-4 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 z-50 flex items-center justify-between gap-3 bg-white/95 backdrop-blur border border-slate-200 shadow-xl rounded-2xl px-4 py-3 print:hidden">
        <Button type="button" variant="outline" onClick={() => window.print()}>
          Download
        </Button>
        {!readOnly ? (
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 rounded-full px-6" form={formId}>
            Save Changes
          </Button>
        ) : null}
      </div>
      <style jsx global>{`
        @media print {
          body {
            background: #fff !important;
          }
          .docx-sheet {
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            width: 210mm !important;
            min-height: 297mm !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="space-y-1 block">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
      {children}
    </label>
  );
}

function toDateValue(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toISOString().slice(0, 10);
}

function formatLongDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

