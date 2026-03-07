"use client";

import { useCallback } from "react";
import { toPng } from "html-to-image";

export function useTicketImageActions({ booking, toast }) {
  const getTicketImageDataUrl = useCallback(async () => {
    const el = document.getElementById("ticket-stay-card");
    if (!el) return null;
    return toPng(el, {
      quality: 1,
      pixelRatio: 2,
      backgroundColor: "#ffffff",
      style: { borderRadius: "1.5rem" },
    });
  }, []);

  const openPrintEntryPass = useCallback(async () => {
    try {
      const dataUrl = await getTicketImageDataUrl();
      if (!dataUrl) return;
      const win = window.open("", "_blank", "noopener,noreferrer,width=900,height=700");
      if (!win) {
        toast({ message: "Please allow popups to print the entry pass.", color: "amber" });
        return;
      }
      const printContent = `
<!DOCTYPE html><html><head><meta charset="utf-8"><title>Entry Pass</title>
<style>body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#fff}
img{max-width:100%;height:auto;display:block}
@media print{body{margin:0;padding:0}img{max-width:100%}}</style></head>
<body><img src="${dataUrl}" alt="Entry Pass" onload="window.print();window.onafterprint=function(){window.close()}" /></body></html>`;
      win.document.write(printContent);
      win.document.close();
      win.focus();
    } catch (err) {
      toast({ message: `Print failed: ${err?.message || "Unknown error"}`, color: "red" });
    }
  }, [getTicketImageDataUrl, toast]);

  const downloadTicket = useCallback(async () => {
    if (!booking) return;
    try {
      const dataUrl = await getTicketImageDataUrl();
      if (!dataUrl) return;
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `ticket-${booking.id}.png`;
      link.click();
    } catch (err) {
      toast({ message: `Download failed: ${err?.message || "Unknown error"}`, color: "red" });
    }
  }, [booking, getTicketImageDataUrl, toast]);

  return {
    openPrintEntryPass,
    downloadTicket,
  };
}
