import { isIP } from "node:net";
import { contactRequestSchema, type ContactInput, type ContactResponse } from "@/lib/contact";
import { LeadNotConfiguredError, sendLead } from "@/lib/email/send-lead";
import { createRateLimiter } from "@/lib/rate-limit";

const MAX_BODY_BYTES = 10_000;
const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

/**
 * Client IP for rate limiting. Vercel sets x-real-ip itself (clients cannot override it);
 * elsewhere we fall back to the first X-Forwarded-For hop. Only syntactically valid IPs are used.
 */
function clientIp(request: Request): string {
  const candidates = [request.headers.get("x-real-ip"), request.headers.get("x-forwarded-for")?.split(",")[0]];
  for (const candidate of candidates) {
    const value = candidate?.trim();
    if (value && isIP(value)) return value;
  }
  return "unknown";
}

function json(body: ContactResponse, status: number, headers?: HeadersInit): Response {
  return Response.json(body, { status, headers });
}

export async function POST(request: Request): Promise<Response> {
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) return json({ ok: false, error: "invalid" }, 413);

  const ip = clientIp(request);
  const rate = limiter(ip);
  if (!rate.allowed) {
    return json({ ok: false, error: "rate_limited" }, 429, { "Retry-After": String(rate.retryAfterSeconds) });
  }

  const raw = await request.text();
  if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) return json({ ok: false, error: "invalid" }, 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "invalid" }, 400);
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return json({ ok: false, error: "invalid" }, 400);
  }

  const parsed = contactRequestSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof ContactInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string") fieldErrors[field as keyof ContactInput] ??= issue.message;
    }
    return json({ ok: false, error: "invalid", fieldErrors }, 400);
  }

  const { website, ...lead } = parsed.data;
  // Honeypot filled in: answer like a success so bots get no signal, but send nothing.
  if (website) {
    console.warn(`[contact] honeypot triggered, ip=${ip}`);
    return json({ ok: true }, 200);
  }

  try {
    await sendLead({ ...lead, ip });
    return json({ ok: true }, 200);
  } catch (error) {
    console.error("[contact] failed to deliver lead", error);
    if (error instanceof LeadNotConfiguredError) return json({ ok: false, error: "not_configured" }, 503);
    return json({ ok: false, error: "send_failed" }, 502);
  }
}
