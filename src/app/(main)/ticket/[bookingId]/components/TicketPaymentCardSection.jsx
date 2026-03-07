"use client";

import React from "react";
import { CreditCard, Upload, ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function TicketPaymentCardSection({
  totalAmount,
  paid,
  balance,
  paymentMethod,
  setPaymentMethod,
  downpayment,
  setDownpayment,
  proofFile,
  setProofFile,
  isSubmitting,
  onSubmitDownpayment,
}) {
  return (
    <Card className="p-8 md:p-10 border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-[2.5rem]">
      <h3 className="text-sm font-black text-emerald-600 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
        <CreditCard size={18} /> Payment & Verification
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Payment Method
              </span>
              <select
                className="w-full rounded-2xl border-slate-100 bg-slate-50 px-4 py-3 font-bold text-slate-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="GCash">GCash</option>
                <option value="Bank">Bank Transfer</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Deposit Amount (PHP)
              </span>
              <input
                className="w-full rounded-2xl border-slate-100 bg-slate-50 px-4 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100"
                type="number"
                value={downpayment}
                onChange={(e) => setDownpayment(Number(e.target.value))}
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Upload Screenshot / Receipt
            </span>
            <div className="relative group border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50/50 hover:bg-white hover:border-blue-400 transition-all cursor-pointer">
              <input
                className="absolute inset-0 opacity-0 cursor-pointer"
                type="file"
                onChange={(e) => setProofFile(e.target.files?.[0] || null)}
              />
              <div className="flex flex-col items-center justify-center gap-2 text-slate-400 group-hover:text-blue-500">
                {proofFile ? (
                  <CheckCircle2 size={24} className="text-emerald-500" />
                ) : (
                  <Upload size={24} />
                )}
                <p className="text-xs font-bold uppercase tracking-tighter">
                  {proofFile ? proofFile.name : "Tap to browse or drop files here"}
                </p>
              </div>
            </div>
          </label>
        </div>

        <div className="lg:col-span-4 bg-slate-900 rounded-[2rem] p-8 text-white flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                Total Contract Price
              </p>
              <p className="text-3xl font-black italic">₱{Number(totalAmount || 0).toLocaleString()}</p>
            </div>
            <div className="h-px bg-white/10 w-full" />
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Already Paid</span>
                <span className="font-bold">₱{Number(paid || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-black text-blue-400 pt-2">
                <span>Balance</span>
                <span>₱{Number(balance || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <Button
            disabled={isSubmitting || !proofFile}
            className="w-full mt-8 bg-emerald-500 hover:bg-emerald-600 h-14 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            onClick={onSubmitDownpayment}
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <ShieldCheck size={18} />
            )}
            {isSubmitting ? "Processing..." : "Submit Payment"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
