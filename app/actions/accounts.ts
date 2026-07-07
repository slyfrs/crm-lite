"use server";

import { prisma } from "@/lib/prisma";
import { accountSchema } from "@/lib/validations";
import {
  emptyToNull,
  formDataToObject,
  parseFormAction,
  revalidateEntityPaths,
} from "@/lib/action-utils";

const ACCOUNT_FIELDS = ["name", "industry", "website", "phone"];

function accountDataFromParsed(parsed: {
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
}) {
  return {
    ...parsed,
    industry: emptyToNull(parsed.industry),
    website: emptyToNull(parsed.website),
    phone: emptyToNull(parsed.phone),
  };
}

export async function createAccount(formData: FormData) {
  const result = parseFormAction(accountSchema, formDataToObject(formData, ACCOUNT_FIELDS));
  if (!result.ok) return { error: result.error };

  const account = await prisma.account.create({ data: accountDataFromParsed(result.data) });

  revalidateEntityPaths("account");
  return { success: true, id: account.id };
}

export async function updateAccount(id: string, formData: FormData) {
  const result = parseFormAction(accountSchema, formDataToObject(formData, ACCOUNT_FIELDS));
  if (!result.ok) return { error: result.error };

  await prisma.account.update({
    where: { id },
    data: accountDataFromParsed(result.data),
  });

  revalidateEntityPaths("account", id);
  return { success: true };
}
