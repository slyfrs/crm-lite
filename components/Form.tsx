"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

export function FormFieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="mt-1 text-xs text-red-600">{messages.join(", ")}</p>;
}

export function FormShell({
  action,
  children,
  cancelHref,
  description,
  submitLabel = "Сохранить",
  className,
}: {
  action: (formData: FormData) => Promise<{ success?: boolean; error?: Record<string, string[]> | string; id?: string }>;
  children: React.ReactNode;
  cancelHref: string;
  description?: string;
  submitLabel?: string;
  className?: string;
}) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors(null);
    setGeneralError(null);
    const formData = new FormData(e.currentTarget);
    const result = await action(formData);
    if (result.success) {
      router.push(result.id ? `${cancelHref}/${result.id}` : cancelHref);
      router.refresh();
    } else if (result.error) {
      if (typeof result.error === "string") {
        setGeneralError(result.error);
      } else {
        setErrors(result.error);
        const form = e.currentTarget;
        Object.keys(result.error).forEach((field) => {
          const el = form.querySelector(`[name="${field}"]`) as HTMLElement;
          if (el) el.classList.add("border-red-500");
        });
      }
    }
  }

  return (
    <Card padding="lg" className={cn("max-w-2xl", className)}>
      {description && <p className="text-sm text-zinc-500 mb-6">{description}</p>}
      <form onSubmit={handleSubmit} className="space-y-5">
        {generalError && <Alert>{generalError}</Alert>}
        {errors && (
          <Alert>
            <div className="space-y-1">
              {Object.entries(errors).map(([field, messages]) => (
                <p key={field}>
                  {field}: {messages.join(", ")}
                </p>
              ))}
            </div>
          </Alert>
        )}
        {children}
        <div className="flex gap-3 pt-4 border-t border-zinc-100">
          <Button type="submit">{submitLabel}</Button>
          <Button type="button" variant="secondary" onClick={() => router.push(cancelHref)}>
            Отмена
          </Button>
        </div>
      </form>
    </Card>
  );
}

export function FormGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-5", className)}>
      {children}
    </div>
  );
}

export function FormSection({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pt-1 border-t border-zinc-100 space-y-5">
      {title && (
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide pt-4">
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

export function FormField({
  label,
  name,
  type = "text",
  required = false,
  defaultValue,
  placeholder,
  className,
  children,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-xs text-zinc-500 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children || (
        <Input
          id={name}
          name={name}
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  );
}
