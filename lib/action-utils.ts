import { revalidatePath } from "next/cache";
import type { ZodType } from "zod";

export type ActionResult = {
  success?: boolean;
  id?: string;
  error?: string | Record<string, string[]>;
};

export function formDataToObject(formData: FormData, fields: string[]): Record<string, string> {
  return Object.fromEntries(
    fields.map((field) => [field, (formData.get(field) as string) ?? ""])
  );
}

export function parseFormAction<T>(
  schema: ZodType<T>,
  raw: unknown
): { ok: true; data: T } | { ok: false; error: Record<string, string[]> } {
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }
  return { ok: true, data: parsed.data };
}

export function emptyToNull(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;
  return value;
}

export function revalidateEntityPaths(
  entity: "lead" | "account" | "contact" | "opportunity",
  id?: string,
  extraPaths: string[] = []
) {
  const paths: Record<typeof entity, string[]> = {
    lead: ["/leads", "/dashboard"],
    account: ["/accounts"],
    contact: ["/contacts"],
    opportunity: ["/opportunities", "/opportunities/pipeline", "/dashboard"],
  };

  for (const path of paths[entity]) {
    revalidatePath(path);
  }
  if (id) {
    revalidatePath(`/${entity === "lead" ? "leads" : entity === "account" ? "accounts" : entity === "contact" ? "contacts" : "opportunities"}/${id}`);
  }
  for (const path of extraPaths) {
    revalidatePath(path);
  }
}
