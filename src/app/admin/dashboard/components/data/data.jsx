import { Mail, ShieldCheck, KeyRound } from "lucide-react";

export const tabs = [
    { id: "resort", label: "Resorts", icon: ShieldCheck },
    { id: "account", label: "Accounts", icon: KeyRound },
    { id: "support", label: "Support", icon: Mail },
  ];

  // Enhanced fake data with user info
export const fakeData = {
    resort: [{ 
      id: "fake-1", 
      title: "Visibility Request", 
      content: "Enable visibility for Resort 1 - Kasbah Villa", 
      requestedBy: "LuxVille Resort",
      isFake: true 
    },
    { 
      id: "fake-2", 
      title: "New Resort Request", 
      content: "New Resort ready to be set up", 
      requestedBy: "New Owner",
      isFake: true 
    }    
    ],
    account: [{ 
      id: "fake-3", 
      title: "Password Reset", 
      content: "Manual override requested for administrative access.", 
      requestedBy: "Kasbah Villa Admin",
      isFake: true 
    }],
    support: [{ 
      id: "fake-4", 
      title: "Booking Issue", 
      content: "Customer reported a double charge on reservation #1", 
      requestedBy: "Celeste Resort",
      isFake: true 
    }]
  };