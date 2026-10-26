import { Resend } from "resend";
import type { ContactInput } from "@/lib/contact";
import { siteConfig, type Locale } from "@/site.config";

export class LeadNotConfiguredError extends Error {}
export class LeadSendError extends Error {}

type Lead = ContactInput & { locale: Locale; ip: string };

function formatLead(lead: Lead): { subject: string; text: string } {
  const subject = `[${siteConfig.name} website] ${lead.name} – ${lead.company}`;
  const text = [
    `Name: ${lead.name}`,
    `Company: ${lead.company}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone}`,
    `Language: ${lead.locale}`,
    `Consent to privacy policy: yes`,
    "",
    "Message:",
    lead.message,
  ].join("\n");
  return { subject, text };
}

/**
 * Sends a lead to CONTACT_TO_EMAIL through Resend.
 * Without RESEND_API_KEY: logs the lead on the server in development, throws in production.
 * The lead is not stored anywhere else.
 */
export async function sendLead(lead: Lead): Promise<{ delivered: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || siteConfig.contact.email;
  const from = process.env.CONTACT_FROM_EMAIL;
  const { subject, text } = formatLead(lead);

  if (!apiKey || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[contact] RESEND_API_KEY or CONTACT_FROM_EMAIL missing; lead logged instead of sent.\nTo: ${to}\nSubject: ${subject}\n${text}`);
      return { delivered: false };
    }
    throw new LeadNotConfiguredError("Email delivery is not configured (RESEND_API_KEY / CONTACT_FROM_EMAIL).");
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({ from, to, replyTo: lead.email, subject, text });
  if (error) throw new LeadSendError(`Resend rejected the email: ${error.name}: ${error.message}`);
  return { delivered: true };
}
