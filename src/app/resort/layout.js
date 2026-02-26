"use client";

import TopBar from "../(main)/layout/TopBar";
import Footer from "../(main)/layout/Footer";
export default function MainLayout({ children }) {
  return (
    <>
      <TopBar />
      <main>{children}</main>
      <Footer />
    </>
  );
}