import React from "react";
import { Card } from "@/components/ui/card";
import { Printer, CheckCircle, Clock, Inbox, AlertCircle, FileDown } from "lucide-react"; // Added Inbox and AlertCircle
import { Button } from "@/components/ui/button";

export default function BookingConfirmation({ data, resortName, onBack }) {
  
  // Logic for Status Styles
  const getStatusConfig = (status) => {
    switch (status) {
      case "Confirmed":
        return {
          colorClass: "bg-emerald-100 text-emerald-700",
          icon: <CheckCircle size={14} />,
          label: "Confirmed"
        };
      case "Checked Out":
        return {
          colorClass: "bg-red-100 text-red-700",
          icon: <AlertCircle size={14} />,
          label: "Checked Out"
        };
      default: // Inquiry / Pending
        return {
          colorClass: "bg-blue-100 text-blue-700",
          icon: <Inbox size={14} />,
          label: status || "Inquiry"
        };
    }
  };

  const statusStyle = getStatusConfig(data?.status);

  return (
    <div className="max-w-4xl mx-auto space-y-6 mt-[10vh]">
      <div className="flex justify-between items-center no-print">
        <Button variant="default" className="hover:scale-105" onClick={onBack}>
          ← Back to List
        </Button>
        
<div className="flex gap-3 items-center">
  {/* Dynamic Status Badge */}
  <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${statusStyle.colorClass}`}>
    {statusStyle.icon}
    {statusStyle.label}
  </div>
  
  {/* Download PDF Button */}
  <Button 
    onClick={() => {
      // Placeholder for PDF logic (e.g., html2pdf().from(element).save())
      console.log("Downloading PDF...");
      window.print(); // Often used as a fallback
    }} 
    variant="default"
    className="text-slate-700 hover:scale-105 flex items-center justify-center transition-all"
  >
    <FileDown size={16} className="mr-2" /> Download PDF
  </Button>

  {/* Print Button */}
  <Button 
    onClick={() => window.print()} 
    className="bg-blue-600 hover:bg-blue-700 hover:scale-105 flex items-center justify-center transition-all shadow-md shadow-blue-100"
  >
    <Printer size={16} className="mr-2" /> Print Form
  </Button>
</div>
      </div>

      <Card className="p-10 bg-white shadow-xl rounded-none relative overflow-hidden">
        <div className="text-center mb-12">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-[0.2em] mb-1">{resortName}</h2>
          <h1 className="text-3xl font-black text-slate-900 uppercase">Confirmation Booking Form</h1>
        </div>

        {/* Section 1: Details */}
        <div className="mb-10">
          <h3 className="text-[10px] font-black text-black uppercase tracking-widest mb-4 border-b pb-1">Section 1: Details</h3>
          <div className="grid grid-cols-2 gap-x-12 gap-y-3">
              <DetailRow label="Guest Name" value={data?.guestName || "________________"} />
              <DetailRow label="Address" value={data?.address || "N/A"} />
              <DetailRow label="Email" value={data?.email || "N/A"} />
              <DetailRow label="Contact Number" value={data?.phoneNumber || "N/A"} />
              <DetailRow label="No. of Guests" value={data?.guestCount || "0"} />
              <DetailRow label="No. of Rooms" value={data?.roomCount || "0"} />
              <DetailRow label="Sleeping Guests" value={data?.sleepingGuests || "0"} />
              <DetailRow label="Base Rate (PHP)" value={data?.baseRate?.toLocaleString() || "0.00"} />
              <DetailRow label="Check-In Date" value={data?.checkInDate} />
              <DetailRow label="Check-In Time" value={data?.checkInTime} />
              <DetailRow label="Check-Out Date" value={data?.checkOutDate} />
              <DetailRow label="Check-Out Time" value={data?.checkOutTime} />
              <DetailRow label="Booking Agent" value={data?.bookingAgent || "Direct"} />
              <DetailRow label="Turnover Authorized Person" value={data?.turnoverAuthorizedPerson || "Same as Guest"} />
            </div>
        </div>

        {/* Section 2: Additional Services */}
        <div className="mb-10">
          <h3 className="text-[10px] font-black text-black uppercase tracking-widest mb-4 border-b pb-1">Section 2: Additional Services</h3>
          <div className="grid grid-cols-2 gap-x-10 gap-y-2">
            {data?.resortServices?.map((s, i) => (
              <div key={i} className="flex justify-between text-sm border-b border-dotted pb-1">
                <span className="text-slate-500">{s.name}</span>
                <span className="font-bold">₱{s.cost}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Breakdown */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <div className="grid grid-cols-2 items-center">
             <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Amount Due</p>
                <p className="text-3xl font-black text-slate-900">₱{data?.totalAmount?.toLocaleString()}</p>
             </div>
             <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Downpayment:</span>
                  <span className="font-bold">₱{data?.downpayment?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Channel:</span>
                  <span className="font-bold uppercase text-[10px]">{data?.paymentMethod || "Pending"}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-black text-lg">
                  <span>Total Due:</span>
                  <span>₱{(data?.totalAmount - (data?.downpayment || 0)).toLocaleString()}</span>
                </div>
             </div>
          </div>
        </div>

        {/* Footer Signatures */}
        <div className="mt-20 flex justify-between">
           <div className="text-center">
              <p className="font-bold border-b border-slate-900 px-8">Management Name</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold mt-1">Resort Admin</p>
           </div>
           <div className="text-center">
              <p className="font-bold border-b border-slate-900 px-8">{data?.guestName || "________________"}</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold mt-1">Client Signature</p>
           </div>
        </div>
      </Card>

    {data?.status === "Inquiry" && (
      <div className="flex items-center justify-center gap-4 mt-6">
        <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-xl px-6 shadow-sm shadow-emerald-100">
          Approve Booking
        </Button>
        <Button
          variant=""
          className="bg-red-500 rounded-xl px-6 font-bold text-white"
        >
          Decline Booking
        </Button>
      </div>
    )}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm gap-4">
      <span className="text-slate-500 font-medium whitespace-nowrap">{label}:</span>
      <span className="text-slate-900 font-bold text-right">{value}</span>
    </div>
  );
}