"use server";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { deleteLead } from "./leads";
import { deleteContact } from "./contacts";
import { deleteOpportunity } from "./opportunities";
import type { ActionResult } from "@/lib/action-utils";
import type { AccountWithRelations } from "@/lib/prisma-types";

function bindDelete(fn: (id: string) => Promise<ActionResult>) {
  return async (formData: FormData) => {
    const id = formData.get("id") as string;
    if (!id) return { error: "ID не указан" };
    return fn(id);
  };
}

export async function deleteAccount(id: string) {
  const account: AccountWithRelations | null = await prisma.account.findUnique({
    where: { id },
    include: { opportunities: true, contacts: true },
  });
  if (!account) return { error: "Компания не найдена" };

  const oppIds = account.opportunities.map((o) => o.id);
  const contactIds = account.contacts.map((c) => c.id);

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    if (oppIds.length > 0) {
      await tx.activity.deleteMany({ where: { opportunityId: { in: oppIds } } });
      await tx.opportunity.deleteMany({ where: { id: { in: oppIds } } });
    }
    if (contactIds.length > 0) {
      await tx.activity.deleteMany({ where: { contactId: { in: contactIds } } });
    }
    await tx.lead.updateMany({
      where: { accountId: id },
      data: { accountId: null, contactId: null, status: "new" },
    });
    await tx.contact.deleteMany({ where: { accountId: id } });
    await tx.activity.deleteMany({ where: { accountId: id } });
    await tx.account.delete({ where: { id } });
  });

  revalidatePath("/accounts");
  return { success: true };
}

export const deleteLeadBound = bindDelete(deleteLead);
export const deleteContactBound = bindDelete(deleteContact);
export const deleteOpportunityBound = bindDelete(deleteOpportunity);
export const deleteAccountBound = bindDelete(deleteAccount);
