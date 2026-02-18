import React, { useState } from "react";
import { 
  Inbox, CheckCircle2, AlertCircle, 
  ChevronRight, Mail, Trash2, Calendar
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RentalManager() {
  const [activeTab, setActiveTab] = useState("inbox"); // inbox, confirmed, overdue

  // Mock data - In a real app, you'd filter your 'bookings' array based on dates
  const mockData = {
    inbox: [
      { id: 1, guest: "Juan Dela Cruz", room: "Room A", dates: "Feb 20 - 22", email: "juan@example.com" }
    ],
    confirmed: [
      { id: 2, guest: "Maria Clara", room: "Room C", dates: "Feb 18 - 25", email: "clara@example.com" }
    ],
    overdue: [
      { id: 3, guest: "Sisa Lopez", room: "Room B", dates: "Feb 10 - 15", email: "sisa@example.com" }
    ]
  };

  const tabs = [
    { id: "inbox", label: "Inquiry Inbox", icon: Inbox, count: mockData.inbox.length },
    { id: "confirmed", label: "Confirmed Stays", icon: CheckCircle2, count: mockData.confirmed.length },
    { id: "overdue", label: "Pending Checkout", icon: AlertCircle, count: mockData.overdue.length },
  ];

  return (
    <Card className="border-slate-200 shadow-xl rounded-3xl overflow-hidden bg-white">
      {/* Panel Header / Tabs */}
      <div className="flex border-b border-slate-100 bg-slate-50/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-2 py-4 px-6 text-sm font-bold transition-all
              ${activeTab === tab.id 
                ? "bg-white text-blue-600 border-b-2 border-blue-600 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]" 
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"}
            `}
          >
            <tab.icon size={18} />
            {tab.label}
            {tab.count > 0 && (
              <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Panel Content */}
      <div className="p-6 min-h-[400px]">
        {mockData[activeTab].length > 0 ? (
          <div className="space-y-3">
            {mockData[activeTab].map((item) => (
              <div key={item.id} className="group flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${activeTab === 'overdue' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.guest}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <span className="font-semibold text-blue-600">{item.room}</span> 
                      • {item.dates}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activeTab === "inbox" && (
                    <>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 rounded-xl">Approve</Button>
                      <Button size="sm" variant="ghost" className="text-slate-400 hover:text-rose-600 rounded-xl">Decline</Button>
                    </>
                  )}
                  {activeTab === "confirmed" && (
                    <Button size="sm" variant="outline" className="rounded-xl border-slate-200 text-slate-600">Send Reminder</Button>
                  )}
                  {activeTab === "overdue" && (
                    <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl">Process Checkout</Button>
                  )}
                  <div className="h-8 w-px bg-slate-100 mx-2" />
                  <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
                    <Mail size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Inbox size={48} className="mb-4 opacity-20" />
            <p className="font-medium">No {activeTab} records found.</p>
          </div>
        )}
      </div>
    </Card>
  );
}