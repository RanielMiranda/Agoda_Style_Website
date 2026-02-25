"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Lock, 
  Camera, 
  CheckCircle2, 
  ArrowRight, 
  Loader2,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ResortSetupPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Example data that would be fetched via the token in the URL
  const inviteData = {
    ownerName: "John Doe",
    resortName: "Seaside Serenity Resort",
    email: "john@example.com"
  };

  const handleCompleteSetup = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsFinished(true);
    }, 2000);
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-12 text-center rounded-[40px] border-none shadow-2xl animate-in zoom-in-95">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4">You're all set!</h1>
          <p className="text-slate-500 mb-8 font-medium">
            Your account is verified and {inviteData.resortName} is now live on the platform.
          </p>
          <Button className="w-full h-14 bg-blue-600 hover:bg-blue-700 rounded-2xl text-lg font-bold shadow-lg shadow-blue-100">
            Go to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Left Side: Branding/Welcome */}
      <div className="lg:w-1/3 bg-blue-600 p-12 flex flex-col justify-between text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-12">
            <Building2 size={28} />
          </div>
          <h1 className="text-4xl font-black mb-6 leading-tight">
            Welcome to the <br />Partner Network.
          </h1>
          <p className="text-blue-100 text-lg font-medium max-w-xs">
            Just a few more steps to secure your account and start managing {inviteData.resortName}.
          </p>
        </div>

        {/* Decorative Element */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-24">
        <div className="max-w-xl w-full">
          <div className="mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Setup Your Account</h2>
            <p className="text-slate-500 font-medium">Verified invite for {inviteData.email}</p>
          </div>

          <form onSubmit={handleCompleteSetup} className="space-y-8">
            {/* Profile Photo Upload */}
            <div className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-200">
                <Camera size={32} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Profile Photo</h4>
                <p className="text-sm text-slate-500 mb-3">Help guests recognize you.</p>
                <button type="button" className="text-sm font-black text-blue-600 hover:text-blue-700">Upload Image</button>
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 ml-1">Create Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="password" 
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="password" 
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 px-1">
              <input type="checkbox" required className="mt-1 w-5 h-5 rounded-lg border-slate-200 text-blue-600 focus:ring-blue-500" />
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                I agree to the <span className="text-blue-600 font-bold cursor-pointer">Terms of Service</span> and <span className="text-blue-600 font-bold cursor-pointer">Privacy Policy</span> regarding resort management.
              </p>
            </div>

            <Button 
              disabled={isSubmitting}
              className="w-full h-16 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-lg font-bold shadow-xl transition-all flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Complete Setup <ArrowRight size={20} />
                </>
              )}
            </Button>
          </form>

          <div className="mt-12 flex items-center justify-center gap-2 text-slate-400">
            <ShieldCheck size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">End-to-End Encrypted Setup</span>
          </div>
        </div>
      </div>
    </div>
  );
}