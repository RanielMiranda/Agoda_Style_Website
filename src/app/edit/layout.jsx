"use client";
import AdminTopBar from "@/app/admin/layout/AdminTopBar";

export default function AdminLayout({ children }) {
  return (
    <div>
        <AdminTopBar />
        {children}
    </div>
  );
}
