"use client";

import React, { createContext, useCallback, useContext, useMemo } from "react";
import { supabase } from "@/lib/supabase";

const SupportContext = createContext(null);

const MESSAGE_COLUMNS = ["id", "booking_id", "sender_role", "sender_name", "message", "created_at"].join(", ");
const ISSUE_COLUMNS = ["id", "booking_id", "guest_name", "guest_email", "subject", "message", "status", "created_at"].join(", ");

const isMissingSupportTableError = (error) =>
  !!error?.message &&
  (error.message.includes("Could not find the table") ||
    error.message.includes("does not exist") ||
    error.message.includes("schema cache"));

export function SupportProvider({ children }) {
  const loadBookingSupport = useCallback(async (bookingId) => {
    const [{ data: messageRows, error: messageError }, { data: issueRows, error: issueError }] = await Promise.all([
      supabase
        .from("ticket_messages")
        .select(MESSAGE_COLUMNS)
        .eq("booking_id", bookingId)
        .order("created_at", { ascending: true }),
      supabase
        .from("ticket_issues")
        .select(ISSUE_COLUMNS)
        .eq("booking_id", bookingId)
        .order("created_at", { ascending: false }),
    ]);

    if (messageError && !isMissingSupportTableError(messageError)) throw messageError;
    if (issueError && !isMissingSupportTableError(issueError)) throw issueError;

    return {
      messages: messageRows || [],
      issues: issueRows || [],
      missingTables: !!(messageError || issueError),
    };
  }, []);

  const listResortConcerns = useCallback(async (resortId, options = {}) => {
    const pruneDays = Number(options.pruneResolvedOlderThanDays || 0);
    if (pruneDays > 0) {
      const cutoffIso = new Date(Date.now() - pruneDays * 24 * 60 * 60 * 1000).toISOString();
      await supabase
        .from("ticket_issues")
        .delete()
        .eq("resort_id", resortId)
        .eq("status", "resolved")
        .lt("created_at", cutoffIso);
    }

    const { data, error } = await supabase
      .from("ticket_issues")
      .select(ISSUE_COLUMNS)
      .eq("resort_id", resortId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  }, []);

  const updateConcernStatus = useCallback(async (issueId, status) => {
    const { error } = await supabase.from("ticket_issues").update({ status }).eq("id", issueId);
    if (error) throw error;
  }, []);

  const sendTicketMessage = useCallback(async (payload) => {
    const { error } = await supabase.from("ticket_messages").insert(payload);
    if (error) throw error;
  }, []);

  const value = useMemo(
    () => ({
      loadBookingSupport,
      listResortConcerns,
      updateConcernStatus,
      sendTicketMessage,
      isMissingSupportTableError,
    }),
    [listResortConcerns, loadBookingSupport, sendTicketMessage, updateConcernStatus]
  );

  return <SupportContext.Provider value={value}>{children}</SupportContext.Provider>;
}

export const useSupport = () => useContext(SupportContext);
