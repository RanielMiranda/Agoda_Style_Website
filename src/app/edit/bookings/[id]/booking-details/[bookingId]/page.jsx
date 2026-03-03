"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { 
  Printer, CheckCircle, Inbox, Clock, 
  ChevronLeft, User, Calendar, CreditCard, 
  MapPin, Phone, Mail, Users, BedDouble, 
  Briefcase, ReceiptText, Wallet, Edit3, 
  FileText, Image as ImageIcon, ExternalLink, ShieldCheck, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BookingModernView({ data, resortName, onBack }) {
  const router = useRouter();
  const { id } = useParams();
  const bookingId = data?.id;
  const [isVerifying, setIsVerifying] = useState(false);
  
  const status = data?.status || "Inquiry";
  // Logic to check if payment is sent
  const hasProof = !!data?.proofOfPaymentUrl; 

  return (
    <div className="min-h-screen bg-slate-50/50 pb-32 mt-10 pt-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* TOP BAR: Navigation & Actions */}
        <div className="flex justify-between items-center no-print">
          <button onClick={onBack} className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all font-bold text-xs uppercase tracking-widest">
            <div className="p-2 bg-white rounded-full shadow-sm group-hover:shadow-md transition-all">
              <ChevronLeft size={16} />
            </div>
            Back to Overview
          </button>

          <div className="flex gap-3 items-center justify-center">
            <Button 
              variant="outline" 
              onClick={() => router.push(`/edit/bookings/${id}/booking-details/${bookingId}/form`)} 
              className="rounded-full flex items-center justify-center bg-white shadow-sm border-slate-200 hover:bg-slate-50 font-bold text-xs px-6">
              <FileText size={16} className="mr-2" /> View Form
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.print()} 
              className="rounded-full flex items-center justify-center bg-white shadow-sm border-slate-200 hover:bg-slate-50 font-bold text-xs px-6">
              <Printer size={16} className="mr-2" /> Export
            </Button>
          </div>
        </div>

        {/* 24-HOUR DEADLINE ALERT (Requirement 3) */}
        {status === "Inquiry" && (
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3 text-amber-700">
              <AlertCircle size={18} />
              <p className="text-xs font-bold uppercase tracking-wider">Payment Deadline: 24 Hours from Approval</p>
            </div>
            <span className="text-[10px] font-black text-amber-500 bg-white px-3 py-1 rounded-full border border-amber-100">AUTO-CANCEL ACTIVE</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* MAIN COLUMN (LHS) */}
          <div className="lg:col-span-2 space-y-8">
            {/* HERO SECTION */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex justify-between items-center">
               <div className="flex items-center gap-6">
                  <div className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                    <User size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-1">{resortName}</p>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{data?.guestName || "name"}</h1>
                  </div>
               </div>
               <StatusBadge status={status} />
            </div>

            {/* DATA GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-4">
                  <SectionLabel icon={<Mail size={14}/>} label="Contact" />
                  <InfoItem label="Email" value={data?.email} />
                  <InfoItem label="Phone" value={data?.phoneNumber} />
               </div>
               <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-4">
                  <SectionLabel icon={<Calendar size={14}/>} label="Stay" />
                  <InfoItem label="Dates" value={`${data?.checkInDate} - ${data?.checkOutDate}`} />
                  <InfoItem label="Rooms" value={`${data?.roomCount} Units`} />
               </div>
            </div>

            {/* ADDITIONAL SERVICES */}
            <div className="space-y-4">
              <SectionLabel icon={<Briefcase size={14}/>} label="Add-ons" />
              <div className="flex flex-wrap gap-3">
                {data?.resortServices?.map((s, i) => (
                  <div key={i} className="bg-white px-4 py-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md"><CheckCircle size={14}/></div>
                    <span className="text-xs font-bold text-slate-700">{s.name} (₱{s.cost})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SIDEBAR (RHS): PAYMENT & PROOF */}
          <div className="space-y-6">
            
            {/* NEW: PROOF OF PAYMENT CARD */}
            <div className={`p-6 rounded-[2rem] border-2 transition-all shadow-xl ${
              hasProof ? "bg-white border-emerald-100 shadow-emerald-50" : "bg-slate-50 border-dashed border-slate-200 shadow-none"
            }`}>
              <div className="flex justify-between items-center mb-6">
                <SectionLabel icon={<ImageIcon size={14}/>} label="Proof of Payment" />
                {hasProof ? (
                  <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-1 rounded-md animate-pulse">RECEIVED</span>
                ) : (
                  <span className="bg-slate-200 text-slate-500 text-[9px] font-black px-2 py-1 rounded-md">AWAITING</span>
                )}
              </div>

              {hasProof ? (
                <div className="space-y-4">
                  <div className="relative group cursor-pointer overflow-hidden rounded-2xl border border-slate-100">
                    <img 
                      src={data.proofOfPaymentUrl} 
                      alt="Payment Receipt" 
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary" size="sm" className="rounded-full text-xs" onClick={() => window.open(data.proofOfPaymentUrl)}>
                         View Fullscreen <ExternalLink size={12} className="ml-2"/>
                      </Button>
                    </div>
                  </div>
                  <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                    <p className="text-[10px] text-emerald-700 font-bold mb-1">Owner Verification</p>
                    <button 
                      onClick={() => setIsVerifying(!isVerifying)}
                      className="flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-tighter"
                    >
                      {isVerifying ? <CheckCircle size={14}/> : <ShieldCheck size={14}/>}
                      {isVerifying ? "Transaction Verified" : "Mark as Verified"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center flex flex-col items-center">
                  <div className="p-4 bg-slate-100 rounded-full mb-3 text-slate-400">
                    <ImageIcon size={24} />
                  </div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                    Client has not uploaded <br/> proof yet
                  </p>
                </div>
              )}
            </div>

            {/* FINANCIAL SUMMARY */}
            <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl space-y-6 relative overflow-hidden">
               <div className="absolute -top-4 -right-4 p-4 opacity-5">
                 <ReceiptText size={120} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Due</p>
                  <p className="text-4xl font-black italic">₱{data?.totalAmount?.toLocaleString()}</p>
               </div>
               <div className="space-y-3 pt-4 border-t border-white/10 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Downpayment</span>
                    <span className="font-bold">₱{data?.downpayment?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Channel</span>
                    <span className="font-black text-blue-400 text-[10px] tracking-widest">{data?.paymentMethod}</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl mt-4">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Balance to Pay</p>
                    <p className="text-2xl font-black">₱{(data?.totalAmount - (data?.downpayment || 0)).toLocaleString()}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING ACTION BAR */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-white/90 backdrop-blur-xl p-3 rounded-2xl border border-slate-200 shadow-2xl no-print">
        {status === "Inquiry" ? (
          <>
            <Button variant="ghost" className="rounded-full px-8 h-12 text-slate-400 hover:text-rose-600 font-bold">Decline</Button>
            <Button className={`rounded-full flex items-center justify-center px-10 h-12 font-bold shadow-lg transition-all flex gap-2 ${
              hasProof ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}>
              <CheckCircle size={18} />
              {hasProof ? "Confirm & Book" : "Approve Inquiry"}
            </Button>
          </>
        ) : (
          <Button 
            onClick={() => router.push(`/edit/bookings/${id}/booking-details/${bookingId}`)}
            className="bg-slate-900 hover:bg-black text-white rounded-full px-10 h-12 font-bold shadow-lg flex gap-2"
          >
            <Edit3 size={18} /> Edit Booking
          </Button>
        )}
      </div>
    </div>
  );
}

/* SUB-COMPONENTS */

function SectionLabel({ icon, label }) {
  return (
    <div className="flex items-center gap-2 px-1">
      <div className="text-blue-600">{icon}</div>
      <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</span>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm font-bold text-slate-900 truncate">{value || "—"}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const isConfirmed = status === "Confirmed";
  return (
    <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-2 ${
      isConfirmed ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-blue-50 border-blue-100 text-blue-700"
    }`}>
      {isConfirmed ? <CheckCircle size={20} /> : <Clock size={20} />}
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Status</span>
        <span className="text-sm font-black uppercase tracking-wider">{status}</span>
      </div>
    </div>
  );
}