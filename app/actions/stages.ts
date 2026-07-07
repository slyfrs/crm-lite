"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { activitySchema } from "@/lib/validations";
import { STAGE_NAMES } from "@/lib/constants";

import { validateLostTransition, validateWonTransition } from "@/lib/opportunity-rules";

export async function moveOpportunityStage(
  opportunityId: string,
  newStageId: string,
  lostReason?: string,
  amount?: number
) {
  const opp = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
    include: { stage: true, lead: true },
  });
  if (!opp) return { error: "Сделка не найдена" };

  if (!opp.leadId || !opp.lead?.accountId) {
    return { error: "Сделка не привязана к сконвертированному лиду" };
  }

  const newStage = await prisma.stage.findUnique({ where: { id: newStageId } });
  if (!newStage) return { error: "Стадия не найдена" };

  const reason = lostReason?.trim() || opp.lostReason?.trim() || null;
  const effectiveAmount = amount ?? opp.amount;

  const wonError = validateWonTransition(newStage.name, effectiveAmount, opp.contactId);
  if (wonError) return { error: wonError };

  const lostError = validateLostTransition(newStage.name, reason);
  if (lostError) return { error: lostError };

  await prisma.opportunity.update({
    where: { id: opportunityId },
    data: {
      stage: { connect: { id: newStageId } },
      lostReason: newStage.name === STAGE_NAMES.LOST ? reason : null,
      ...(amount != null && { amount }),
    },
  });

  revalidatePath("/opportunities");
  revalidatePath(`/opportunities/${opportunityId}`);
  revalidatePath("/opportunities/pipeline");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function toggleActivityDone(activityId: string, done: boolean) {
  try {
    await prisma.activity.update({
      where: { id: activityId },
      data: { done },
    });
  } catch {
    return { error: "Активность не найдена" };
  }

  revalidatePath("/leads");
  revalidatePath("/opportunities");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function createActivity(formData: FormData) {
  const raw = {
    type: formData.get("type") as string,
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    dueDate: (formData.get("dueDate") as string) ?? "",
    leadId: (formData.get("leadId") as string) || null,
    accountId: (formData.get("accountId") as string) || null,
    contactId: (formData.get("contactId") as string) || null,
    opportunityId: (formData.get("opportunityId") as string) || null,
  };

  const parsed = activitySchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.activity.create({
    data: {
      type: parsed.data.type,
      title: parsed.data.title,
      description: parsed.data.description || null,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      leadId: parsed.data.leadId || null,
      accountId: parsed.data.accountId || null,
      contactId: parsed.data.contactId || null,
      opportunityId: parsed.data.opportunityId || null,
    },
  });

  if (parsed.data.leadId) revalidatePath(`/leads/${parsed.data.leadId}`);
  if (parsed.data.accountId) revalidatePath(`/accounts/${parsed.data.accountId}`);
  if (parsed.data.contactId) revalidatePath(`/contacts/${parsed.data.contactId}`);
  if (parsed.data.opportunityId) revalidatePath(`/opportunities/${parsed.data.opportunityId}`);
  revalidatePath("/dashboard");

  return { success: true };
}
