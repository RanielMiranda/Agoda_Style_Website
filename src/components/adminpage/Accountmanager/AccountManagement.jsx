"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Users, UserPlus, Search, MoreVertical, 
  ShieldCheck, ShieldAlert, Mail, Phone, 
  Building2, Edit3, KeyRound, Trash2, Eye, History
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { resorts as resortsData } from "@/components/data/resorts";

// --- Custom Dropdown Component ---
function ActionMenu({ account, onViewResort }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition-all ${isOpen ? 'bg-slate-200 text-slate-900' : 'text-slate-300 hover:text-slate-600 hover:bg-slate-100'}`}
      >
        <MoreVertical size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in duration-100">
          <div className="p-2 border-b border-slate-50 bg-slate-50/50">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Owner Actions</p>
          </div>
          
          <div className="p-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group text-left">
              <Edit3 size={16} className="text-slate-400 group-hover:text-blue-500" />
              <div className="flex flex-col">
                <span className="font-bold">Edit Profile</span>
                <span className="text-[10px] text-slate-400">Update details</span>
              </div>
            </button>

            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group text-left">
              <KeyRound size={16} className="text-slate-400 group-hover:text-blue-500" />
              <span className="font-bold">Reset Password</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group text-left mt-2">
              <Mail size={16} className="text-slate-400 group-hover:text-blue-500" />
              <div className="flex flex-col">
                <span className="font-bold">Send a Message</span>
              </div>
            </button>            
          </div>

          <div className="p-2 border-t border-slate-50 bg-slate-50/50">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Platform</p>
          </div>

          <div className="p-1">
            {/* LINKED VIEW RESORT BUTTON */}
            <button 
              onClick={() => {
                onViewResort(account.resortName);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-left"
            >
              <Eye size={16} />
              <span className="font-bold">View Resort Page</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors text-left">
              <Trash2 size={16} />
              <span className="font-bold">Delete Account</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Main Component ---
export default function AccountManagement() {
  const router = useRouter();
  
  const [accounts, setAccounts] = useState(resortsData.map((resort, index) => ({
    id: String(index + 1),
    name: resort.ownerName || `Admin ${index + 1}`,
    email: resort.contactEmail || "contact@resort.com",
    phone: resort.contactPhone || "+63 000 000 0000",
    resortName: resort.name,
    status: resort.status || (index % 3 === 0 ? "Active" : index % 3 === 1 ? "Pending" : "Suspended"),
    joinedDate: resort.joinedDate || "2024-01-01",
    profileImage: resort.profileImage
  })));

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const handleViewResort = (resortName) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    router.push(`/resort/${encodeURIComponent(resortName)}`);
  };

  const filteredAccounts = accounts.filter(acc => {
    const matchesSearch = acc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          acc.resortName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "All" || acc.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const toggleStatus = (id) => {
    setAccounts(accounts.map(acc => {
      if (acc.id === id) {
        const newStatus = acc.status === "Active" ? "Suspended" : "Active";
        return { ...acc, status: newStatus };
      }
      return acc;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 pt-20 my-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
              <Users className="text-blue-600" />
              Account Management
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Manage resort owner credentials and platform access.</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-12 flex items-center shadow-lg shadow-blue-100 px-6 font-bold">
            <UserPlus className="mr-2 h-5 w-5" />
            Invite Owner
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Total Owners", value: accounts.length, icon: Users, color: "bg-blue-50 text-blue-600" },
            { label: "Pending Approval", value: accounts.filter(a => a.status === 'Pending').length, icon: ShieldAlert, color: "bg-amber-50 text-amber-600" },
            { label: "Active Accounts", value: accounts.filter(a => a.status === 'Active').length, icon: ShieldCheck, color: "bg-green-50 text-green-600" }
          ].map((stat, i) => (
            <Card key={i} className="p-6 bg-white border-none shadow-sm flex items-center gap-4 rounded-3xl">
              <div className={`p-4 rounded-2xl ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Search owners..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border-none rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex p-1.5 bg-slate-200/50 rounded-2xl gap-1">
            {["All", "Active", "Pending", "Suspended"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-tighter transition-all ${
                  filterStatus === status 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex flex-col gap-4">
          {filteredAccounts.length > 0 ? (
            filteredAccounts.map((account) => (
              <Card key={account.id} className="p-4 bg-white border-none hover:shadow-xl transition-all duration-300 rounded-3xl group relative">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  
                  {/* Identity */}
                  <div className="flex items-center gap-4 lg:w-1/4 shrink-0">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-sm">
                        {account.profileImage ? (
                          <img src={account.profileImage} className="w-full h-full object-cover" alt="profile" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-blue-600 font-black text-xl">
                            {account.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        account.status === 'Active' ? 'bg-green-500' :
                        account.status === 'Pending' ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-bold text-slate-900 truncate tracking-tight">{account.name}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 font-bold uppercase tracking-tighter">
                        <Building2 size={12} /> {account.resortName}
                      </p>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                      <Mail size={16} className="text-slate-300" />
                      <span className="truncate">{account.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                      <Phone size={16} className="text-slate-300" />
                      <span>{account.phone}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 border-t lg:border-t-0 pt-4 lg:pt-0 shrink-0">
                    {account.status !== "Pending" ? (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleStatus(account.id)}
                        className={`rounded-xl h-10 px-4 font-black text-[10px] uppercase tracking-widest ${
                          account.status === 'Active' ? 'text-red-400 hover:text-red-500' : 'text-green-500 hover:text-green-600'
                        }`}
                      >
                        {account.status === 'Active' ? 'Suspend' : 'Restore'}
                      </Button>
                    ) : (
                      <Button className="bg-green-500 hover:bg-green-600 text-white rounded-xl h-10 px-6 font-bold text-xs uppercase tracking-widest">
                        Approve
                      </Button>
                    )}

                    {/* PASSING THE NAV FUNCTION HERE */}
                    <ActionMenu account={account} onViewResort={handleViewResort} />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-24 bg-white rounded-[40px] shadow-inner border-2 border-dashed border-slate-100">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">No accounts found</h3>
              <p className="text-slate-400 mt-1 font-medium">Try a different search term.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}