export async function logEmailDelivery(supabaseClient, payload) {
  if (!supabaseClient) {
    throw new Error("Supabase client is required for email tracking.");
  }

  const row = {
    template_key: payload.templateKey || "generic",
    recipient_email: payload.recipientEmail || null,
    recipient_name: payload.recipientName || null,
    booking_id: payload.bookingId || null,
    resort_id: payload.resortId ? Number(payload.resortId) : null,
    account_id: payload.accountId ? Number(payload.accountId) : null,
    provider: payload.provider || null,
    provider_message_id: payload.providerMessageId || null,
    status: payload.status || "sent",
    error_message: payload.errorMessage || null,
    metadata: payload.metadata || {},
  };

  const { error } = await supabaseClient.from("email_delivery_logs").insert(row);
  if (error) throw error;
}
