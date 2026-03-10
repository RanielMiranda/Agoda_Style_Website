import { supabase } from "@/lib/supabase";

export async function notifyCaretakerOnPaymentApproval({
  bookingId,
  resortId,
  guestName,
  amount,
  method,
}) {
  const message = `Payment approved for booking ${bookingId}. Guest: ${guestName || "Guest"}, Amount: PHP ${Number(amount || 0).toLocaleString()}, Method: ${method || "Pending"}.`;
  // Hook point for future SMS/email integration.
  console.info("[CaretakerHook]", message);
}
