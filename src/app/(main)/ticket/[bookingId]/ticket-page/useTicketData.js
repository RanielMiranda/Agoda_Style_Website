"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BOOKING_TICKET_COLUMNS, TICKET_MESSAGE_COLUMNS } from "./constants";
import { isMissingSupportTableError } from "./helpers";
import { isTicketTokenValid } from "@/lib/ticketAccess";

export function useTicketData({ normalizedBookingId, accessToken, toast }) {
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [resort, setResort] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const fetchMessages = useCallback(
    async (activeBookingId) => {
      setLoadingMessages(true);
      try {
        const { data, error } = await supabase
          .from("ticket_messages")
          .select(TICKET_MESSAGE_COLUMNS)
          .eq("booking_id", activeBookingId)
          .order("created_at", { ascending: true });
        if (error) throw error;
        setMessages(data || []);
      } catch (err) {
        if (isMissingSupportTableError(err)) {
          setMessages([]);
          return;
        }
        toast({ message: `Unable to load messages: ${err.message}`, color: "red" });
      } finally {
        setLoadingMessages(false);
      }
    },
    [toast],
  );

  const fetchTicket = useCallback(async () => {
    if (!normalizedBookingId) return;
    setLoading(true);
    try {
      const { data: bookingRows, error: bookingError } = await supabase
        .from("bookings")
        .select(BOOKING_TICKET_COLUMNS)
        .eq("id", normalizedBookingId)
        .order("created_at", { ascending: false })
        .limit(2);
      if (bookingError) throw bookingError;
      if (!bookingRows || bookingRows.length === 0) {
        throw new Error(`Ticket not found for ID: ${normalizedBookingId}`);
      }
      if (bookingRows.length > 1) {
        toast({
          message: "Duplicate ticket IDs found. Showing latest record.",
          color: "amber",
        });
      }

      const bookingData = bookingRows[0];
      const cookieRoleMatch = typeof document !== "undefined" ? document.cookie.match(/(?:^|;\s*)app_role=([^;]+)/) : null;
      const role = cookieRoleMatch ? decodeURIComponent(cookieRoleMatch[1] || "").toLowerCase() : "";
      const isStaff = role === "admin" || role === "owner";
      if (!isStaff && !isTicketTokenValid(bookingData?.booking_form || {}, accessToken)) {
        throw new Error("Ticket access token is missing, invalid, or expired.");
      }

      setBooking(bookingData);

      if (bookingData?.resort_id) {
        const { data: resortData, error: resortError } = await supabase
          .from("resorts")
          .select("id, name, location, contactEmail, contactPhone, contactMedia, rooms, payment_image_url")
          .eq("id", bookingData.resort_id)
          .single();
        if (resortError) throw resortError;
        setResort(resortData);
      } else {
        setResort(null);
      }

      await fetchMessages(bookingData.id);
    } catch (err) {
      toast({ message: `Unable to load ticket: ${err.message}`, color: "red" });
    } finally {
      setLoading(false);
    }
  }, [accessToken, fetchMessages, normalizedBookingId, toast]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  return {
    loading,
    booking,
    setBooking,
    resort,
    messages,
    loadingMessages,
    fetchTicket,
    fetchMessages,
  };
}
