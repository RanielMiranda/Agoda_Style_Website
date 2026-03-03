"use client";
import "./globals.css";
import { ResortDataProvider } from "@/components/useclient/ResortDataClient";
import { ResortProvider } from "@/components/useclient/ContextEditor";
import { BookingsProvider } from "@/components/useclient/BookingsClient";
import { SupportProvider } from "@/components/useclient/SupportClient";
import { ToastProvider } from "@/components/ui/toast/ToastProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ResortDataProvider>
          <ResortProvider>
            <BookingsProvider>
              <SupportProvider>
                <ToastProvider>{children}</ToastProvider>
              </SupportProvider>
            </BookingsProvider>
          </ResortProvider>
        </ResortDataProvider>
      </body>
    </html>
  );
}
