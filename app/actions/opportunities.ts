"use server";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createOpportunitySchema, opportunitySchema } from "@/lib/validations";
import { STAGE_NAMES } from "@/lib/constants";
import { validateLostTransition, validateWonTransition } from "@/lib/opportunity-rules";
import { emptyToNull, formDataToObject, parseFormAction, revalidateEntityPaths } from "@/lib/action-utils";

const OPPORTUNITY_FIELDS = ["name", "amount", "stageId", "accountId", "contactId", "lostReason"];
const CREATE_OPPORTUNITY_FIELDS = ["name", "amount", "stageId", "leadId", "lostReason"];

async function getStageName(stageId: string) {
  const stage = await prisma.stage.findUnique({ where: { id: stageId } });
  return stage?.name ?? null;
}

export async function createOpportunity(formData: FormData) {
  const result = parseFormAction(
    createOpportunitySchema,
    formDataToObject(formData, CREATE_OPPORTUNITY_FIELDS)
  );
  if (!result.ok) return { error: result.error };

  const lead = await prisma.lead.findUnique({
    where: { id: result.data.leadId },
  });
  if (!lead) return { error: "Лид не найден" };
  if (lead.status !== "converted" || !lead.accountId || !lead.contactId) {
    return { error: "Сделку можно создать только для конвертированного лида" };
  }

  const stageName = await getStageName(result.data.stageId);
  if (!stageName) return { error: "Стадия не найдена" };

  const lostReason = result.data.lostReason?.trim() || null;

  const wonError = validateWonTransition(stageName, result.data.amount ?? null, lead.contactId);
  if (wonError) return { error: wonError };

  const lostError = validateLostTransition(stageName, lostReason);
  if (lostError) return { error: lostError };

  const opportunity = await prisma.opportunity.create({
    data: {
      name: result.data.name,
      amount: result.data.amount ?? null,
      stageId: result.data.stageId,
      lostReason: stageName === STAGE_NAMES.LOST ? lostReason : null,
      accountId: lead.accountId,
      contactId: lead.contactId,
      leadId: lead.id,
    },
  });

  revalidateEntityPaths("opportunity", opportunity.id, [
    `/leads/${lead.id}`,
    `/accounts/${lead.accountId}`,
    `/contacts/${lead.contactId}`,
  ]);
  return { success: true, id: opportunity.id };
}

export async function updateOpportunity(id: string, formData: FormData) {
  const result = parseFormAction(opportunitySchema, formDataToObject(formData, OPPORTUNITY_FIELDS));
  if (!result.ok) return { error: result.error };

  const stageName = await getStageName(result.data.stageId);
  if (!stageName) return { error: "Стадия не найдена" };

  const lostReason = result.data.lostReason?.trim() || null;

  const wonError = validateWonTransition(
    stageName,
    result.data.amount ?? null,
    result.data.contactId || null
  );
  if (wonError) return { error: wonError };

  const lostError = validateLostTransition(stageName, lostReason);
  if (lostError) return { error: lostError };

  await prisma.opportunity.update({
    where: { id },
    data: {
      name: result.data.name,
      amount: result.data.amount ?? null,
      stageId: result.data.stageId,
      accountId: emptyToNull(result.data.accountId),
      contactId: emptyToNull(result.data.contactId),
      lostReason: stageName === STAGE_NAMES.LOST ? lostReason : null,
    },
  });

  revalidateEntityPaths("opportunity", id);
  return { success: true };
}

export async function deleteOpportunity(id: string) {
  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.activity.deleteMany({ where: { opportunityId: id } });
    await tx.opportunity.delete({ where: { id } });
  });
  revalidateEntityPaths("opportunity");
  return { success: true };
}
