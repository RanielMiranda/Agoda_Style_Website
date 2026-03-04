"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminTopBar from "@/app/admin/layout/AdminTopBar";
import OwnerTopBar from "@/app/owner/layout/OwnerTopBar";
import { useResort } from "@/components/useclient/ContextEditor";
import { useAccounts } from "@/components/useclient/AccountsClient";

export default function AdminLayout({ children }) {
  const { resort } = useResort();
  const { activeAccount } = useAccounts();
  const pathname = usePathname();
  const primaryColor = resort?.description?.theme?.primaryColor || "#2563eb";

  const role = (activeAccount?.role || "").toLowerCase();
  const isAdmin = role === "admin";
  const crumbs = (pathname || "")
    .split("/")
    .filter(Boolean)
    .map((segment, index, parts) => {
      const href = `/${parts.slice(0, index + 1).join("/")}`;
      const label = segment
        .replace(/-/g, " ")
        .replace(/\[|\]/g, "")
        .replace(/^./, (c) => c.toUpperCase());
      return { href, label };
    });

  return (
    <div style={{ "--editor-primary": primaryColor }}>
      {isAdmin ? <AdminTopBar /> : <OwnerTopBar />}
      <div className="fixed top-[72px] left-0 right-0 z-[90] bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2 text-xs font-semibold text-slate-500 overflow-x-auto whitespace-nowrap">
          {crumbs.map((crumb, index) => (
            <div key={`${crumb.href}-${index}`} className="flex items-center gap-2">
              <Link href={crumb.href} className="hover:text-blue-600 transition-colors">
                {crumb.label}
              </Link>
              {index < crumbs.length - 1 ? <span className="text-slate-300">{">"}</span> : null}
            </div>
          ))}
        </div>
      </div>
      <div className="pt-[34px]">
      <div className="editor-theme">{children}</div>
      </div>
    </div>
  );
}
