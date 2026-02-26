"use client";
import TopBar from "./layout/TopBar";
import Footer from "./layout/Footer";

export default function MainLayout({ children }) {
  return (
    <>
      <TopBar />
      <main>{children}</main>
      <Footer />
    </>
  );
}