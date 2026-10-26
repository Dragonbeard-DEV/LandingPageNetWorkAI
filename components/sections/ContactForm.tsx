"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useId, useState, type ReactNode } from "react";
import { useForm, type FieldError, type UseFormRegisterReturn } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { contactSchema, type ContactInput, type ContactResponse } from "@/lib/contact";
import { Link } from "@/lib/i18n/navigation";

type Status = "idle" | "submitting" | "success" | "error";

type FieldProps = {
  label: string;
  error?: FieldError;
  errorText?: string;
  registration: UseFormRegisterReturn;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  multiline?: boolean;
};

const inputClass =
  "mt-2 block w-full rounded-[var(--radius-control)] border border-border-strong bg-card px-4 py-3 text-strong hover:border-border-strong-hover aria-[invalid=true]:border-error-text";

function Field({ label, error, errorText, registration, type = "text", autoComplete, multiline }: FieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const shared = {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    "aria-required": true,
    className: inputClass,
    ...registration,
  };
  return (
    <div className={cn(multiline && "sm:col-span-2")}>
      <label htmlFor={id} className="font-medium text-strong">
        {label}
      </label>
      {multiline ? <textarea rows={6} {...shared} /> : <input type={type} autoComplete={autoComplete} {...shared} />}
      {error && (
        <p id={errorId} className="mt-2 text-sm text-error-text">
          {errorText}
        </p>
      )}
    </div>
  );
}

function Alert({ tone, children }: { tone: "success" | "error"; children: ReactNode }) {
  const toneClass =
    tone === "success" ? "border-success-border bg-success-bg text-success-text" : "border-error-border bg-error-bg text-error-text";
  return <div className={cn("rounded-[var(--radius-control)] border px-4 py-3 font-medium", toneClass)}>{children}</div>;
}

export function ContactForm() {
  const t = useTranslations("form");
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");
  const [errorKey, setErrorKey] = useState<string>("generic");
  const [honeypot, setHoneypot] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { name: "", company: "", email: "", phone: "", message: "" },
  });

  const errorText = (error?: FieldError) => (error?.message ? t(`errors.${error.message}`) : undefined);

  const onSubmit = async (values: ContactInput) => {
    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypot, locale }),
      });
      const result = (await response.json()) as ContactResponse;
      if (result.ok) {
        setStatus("success");
        reset();
        return;
      }
      for (const [field, key] of Object.entries(result.fieldErrors ?? {})) {
        setError(field as keyof ContactInput, { type: "server", message: key });
      }
      setErrorKey(result.error === "rate_limited" ? "rateLimited" : result.error === "invalid" ? "invalid" : "generic");
      setStatus("error");
    } catch {
      setErrorKey("network");
      setStatus("error");
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} aria-labelledby="contact-form-title" className="rounded-[var(--radius-card)] border border-border-soft bg-card p-6 shadow-card md:p-8">
      <h2 id="contact-form-title" className="text-2xl font-bold">
        {t("title")}
      </h2>
      <p className="mt-2 text-muted">{t("intro")}</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Field label={t("name")} registration={register("name")} error={errors.name} errorText={errorText(errors.name)} autoComplete="name" />
        <Field label={t("company")} registration={register("company")} error={errors.company} errorText={errorText(errors.company)} autoComplete="organization" />
        <Field label={t("email")} type="email" registration={register("email")} error={errors.email} errorText={errorText(errors.email)} autoComplete="email" />
        <Field label={t("phone")} type="tel" registration={register("phone")} error={errors.phone} errorText={errorText(errors.phone)} autoComplete="tel" />
        <Field label={t("message")} registration={register("message")} error={errors.message} errorText={errorText(errors.message)} multiline />
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots that fill it are ignored by the API. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-website">{t("honeypot")}</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
      </div>

      <div className="mt-6">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            {...register("consent")}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            className="mt-1 size-5 shrink-0 accent-[var(--brand-500)]"
          />
          <span className="text-body">
            {t.rich("consent", {
              link: (chunks) => (
                <Link href="/privacy-policy" className="font-medium text-brand-500 underline underline-offset-2">
                  {chunks}
                </Link>
              ),
            })}
          </span>
        </label>
        {errors.consent && (
          <p id="consent-error" className="mt-2 text-sm text-error-text">
            {errorText(errors.consent)}
          </p>
        )}
      </div>

      <div aria-live="polite" role="status" className="mt-6 empty:hidden">
        {status === "success" && (
          <Alert tone="success">
            <p className="font-semibold">{t("successTitle")}</p>
            <p className="font-normal">{t("successText")}</p>
          </Alert>
        )}
        {status === "error" && <Alert tone="error">{t(`submitErrors.${errorKey}`)}</Alert>}
      </div>

      <Button type="submit" disabled={status === "submitting"} className="mt-6 w-full sm:w-auto">
        {status === "submitting" ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
