// Contact form schema shared by the client form and the API route.
// Error messages are message keys under "form.errors" in messages/<locale>.json.
import { z } from "zod";
import { locales } from "@/site.config";

const SINGLE_LINE = /^[^\r\n]*$/;
const PHONE = /^\+?[0-9 ().-]{6,20}$/;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "nameRequired").max(100, "nameTooLong").regex(SINGLE_LINE, "nameInvalid"),
  company: z.string().trim().min(1, "companyRequired").max(120, "companyTooLong").regex(SINGLE_LINE, "companyInvalid"),
  email: z.string().trim().max(200, "emailInvalid").pipe(z.email("emailInvalid")),
  phone: z.string().trim().regex(PHONE, "phoneInvalid"),
  message: z.string().trim().min(10, "messageTooShort").max(2000, "messageTooLong"),
  consent: z.literal(true, "consentRequired"),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** What the API accepts: the form fields plus the honeypot and the visitor's locale. */
export const contactRequestSchema = contactSchema.extend({
  website: z.string().max(200).optional(),
  locale: z.enum(locales),
});

export type ContactRequest = z.infer<typeof contactRequestSchema>;

export type ContactErrorCode = "invalid" | "rate_limited" | "not_configured" | "send_failed";

export type ContactResponse =
  | { ok: true }
  | { ok: false; error: ContactErrorCode; fieldErrors?: Partial<Record<keyof ContactInput, string>> };
