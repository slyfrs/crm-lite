"use server";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { convertLeadSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function convertLead(leadId: string, formData: FormData) {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) return { error: "Лид не найден" };
  if (lead.accountId) return { error: "Лид уже конвертирован" };

  if (!lead.firstName?.trim()) return { error: "Имя лида обязательно" };
  if (!lead.lastName?.trim()) return { error: "Фамилия лида обязательна" };

  const parsed = convertLeadSchema.safeParse({
    email: formData.get("email"),
    phone: formData.get("phone"),
    accountMode: formData.get("accountMode"),
    company: formData.get("company"),
    accountId: formData.get("accountId"),
    createOpportunity: formData.get("createOpportunity"),
    opportunityName: formData.get("opportunityName"),
    opportunityAmount: formData.get("opportunityAmount"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const {
    email,
    phone,
    accountMode,
    company,
    accountId,
    createOpportunity,
    opportunityName,
    opportunityAmount,
  } = parsed.data;

  const initialStage = await prisma.stage.findFirst({ where: { name: "Новый" } });

  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    let account;
    if (accountMode === "existing") {
      account = await tx.account.findUnique({ where: { id: accountId! } });
      if (!account) throw new Error("Компания не найдена");
    } else {
      account = await tx.account.create({
        data: {
          name: company!,
          phone,
        },
      });
    }

    const oppName =
      opportunityName?.trim() || `${account.name} — сделка`;

    await tx.lead.update({
      where: { id: leadId },
      data: { email, phone, company: account.name },
    });

    const contact = await tx.contact.create({
      data: {
        firstName: lead.firstName!,
        lastName: lead.lastName!,
        email,
        phone,
        accountId: account.id,
      },
    });

    let opportunity = null;
    if (createOpportunity && initialStage) {
      opportunity = await tx.opportunity.create({
        data: {
          name: oppName,
          amount: opportunityAmount ?? null,
          stageId: initialStage.id,
          accountId: account.id,
          contactId: contact.id,
          leadId: lead.id,
        },
      });
    }

    await tx.lead.update({
      where: { id: leadId },
      data: {
        status: "converted",
        accountId: account.id,
        contactId: contact.id,
      },
    });

    return { account, contact, opportunity };
  }).catch((e: Error) => {
    if (e.message === "Компания не найдена") return null;
    throw e;
  });

  if (!result) return { error: "Компания не найдена" };

  revalidatePath(`/leads/${leadId}`);
  revalidatePath("/leads");
  revalidatePath("/accounts");
  revalidatePath("/contacts");
  revalidatePath("/opportunities");

  return {
    success: true,
    accountId: result.account.id,
    contactId: result.contact.id,
    opportunityId: result.opportunity?.id,
  };
}
