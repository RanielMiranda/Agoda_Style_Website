"use client";
import AdminTopBar from "./layout/AdminTopBar";

export default function AdminLayout({ children }) {
  return (
    <div>
        <AdminTopBar />
        {children}
    </div>
  );
}
