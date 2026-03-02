"use client";

import OwnerTopBar from "./layout/OwnerTopBar";

export default function AdminLayout({ children }) {
  return (
    <div>
        <OwnerTopBar />
        {children}
    </div>
  );
}
