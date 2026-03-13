import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/server/session";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const hostHeader = request.headers.get("host") || "";
  const host = hostHeader.split(":")[0].toLowerCase();
  const isPortalHost = host.startsWith("portal.");
  const session = await getSessionFromRequest(request);
  const appAuth = !!session;
  const appRole = String(session?.role || "").toLowerCase();
  const isAdminRoute = pathname.startsWith("/admin");
  const isOwnerRoute = pathname.startsWith("/owner");
  const isEditRoute = pathname.startsWith("/edit");
  const isLoginPage = pathname === "/auth/login";
{/*
  const isAssetRoute =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/api");

  if (!isPortalHost && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isPortalHost && (isAdminRoute || isOwnerRoute || isEditRoute)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isPortalHost && !isAssetRoute && !isLoginPage && !(isAdminRoute || isOwnerRoute || isEditRoute)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isLoginPage && appAuth && ["admin", "owner"].includes(appRole)) {
    const target = appRole === "admin" ? "/admin/dashboard" : "/owner/dashboard";
    return NextResponse.redirect(new URL(target, request.url));
  }
  
*/}
  if (isAdminRoute || isOwnerRoute || isEditRoute) {
    if (!appAuth) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (!["admin", "owner"].includes(appRole)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (isAdminRoute && appRole === "owner") {
      return NextResponse.redirect(new URL("/owner/dashboard", request.url));
    }
    if (isOwnerRoute && appRole === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth/login", "/admin/:path*", "/owner/:path*", "/edit/:path*"],
};
