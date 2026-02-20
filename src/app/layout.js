"use client";
import "./globals.css";
import { ResortProvider } from "@/components/useclient/ContextEditor";
import { FilterProvider } from "@/components/useclient/ContextFilter";
import TopBar from "@/components/ui/layouts/TopBar";
import Footer from "@/components/ui/layouts/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ResortProvider>
          <FilterProvider>
            <TopBar/>
            {children}
            <Footer />
          </FilterProvider>
        </ResortProvider>
      </body>
    </html>
  );
}
