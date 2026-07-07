"use server";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { leadSchema } from "@/lib/validations";
import { isLeadConverted } from "@/lib/constants";
import {
  emptyToNull,
  formDataToObject,
  parseFormAction,
  revalidateEntityPaths,
} from "@/lib/action-utils";
import { z } from "zod";

const LEAD_FIELDS = ["firstName", "lastName", "email", "phone", "company", "source"];

function leadDataFromParsed(parsed: z.infer<typeof leadSchema>) {
  return {
    ...parsed,
    email: emptyToNull(parsed.email),
    phone: emptyToNull(parsed.phone),
    company: emptyToNull(parsed.company),
  };
}

export async function createLead(formData: FormData) {
  const result = parseFormAction(leadSchema, formDataToObject(formData, LEAD_FIELDS));
  if (!result.ok) return { error: result.error };

  const lead = await prisma.lead.create({ data: leadDataFromParsed(result.data) });

  revalidateEntityPaths("lead");
  return { success: true, id: lead.id };
}

export async function updateLead(id: string, formData: FormData) {
  const existing = await prisma.lead.findUnique({ where: { id } });
  if (!existing) return { error: "Лид не найден" };

  const updateSchema = leadSchema.extend({
    status: z.enum(["new", "converted"]),
  });

  const result = parseFormAction(updateSchema, {
    ...formDataToObject(formData, LEAD_FIELDS),
    status: (formData.get("status") as string) || existing.status,
  });
  if (!result.ok) return { error: result.error };

  await prisma.lead.update({
    where: { id },
    data: leadDataFromParsed(result.data),
  });

  revalidateEntityPaths("lead", id);
  return { success: true };
}

export async function deleteLead(id: string) {
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return { error: "Лид не найден" };
  if (isLeadConverted(lead)) {
    return { error: "Нельзя удалить сконвертированный лид. Сначала удалите связанные сделки и компанию." };
  }

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.activity.deleteMany({ where: { leadId: id } });
    await tx.lead.delete({ where: { id } });
  });
  revalidateEntityPaths("lead");
  return { success: true };
}
