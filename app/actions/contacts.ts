"use server";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";
import type { OpportunityIdOnly } from "@/lib/prisma-types";
import {
  emptyToNull,
  formDataToObject,
  parseFormAction,
  revalidateEntityPaths,
} from "@/lib/action-utils";

const CONTACT_FIELDS = ["firstName", "lastName", "email", "phone", "jobTitle", "accountId"];

function contactDataFromParsed(parsed: {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  accountId?: string;
}) {
  return {
    ...parsed,
    email: emptyToNull(parsed.email),
    phone: emptyToNull(parsed.phone),
    jobTitle: emptyToNull(parsed.jobTitle),
    accountId: emptyToNull(parsed.accountId),
  };
}

export async function createContact(formData: FormData) {
  const result = parseFormAction(contactSchema, formDataToObject(formData, CONTACT_FIELDS));
  if (!result.ok) return { error: result.error };

  const contact = await prisma.contact.create({ data: contactDataFromParsed(result.data) });

  revalidateEntityPaths("contact");
  return { success: true, id: contact.id };
}

export async function updateContact(id: string, formData: FormData) {
  const result = parseFormAction(contactSchema, formDataToObject(formData, CONTACT_FIELDS));
  if (!result.ok) return { error: result.error };

  await prisma.contact.update({
    where: { id },
    data: contactDataFromParsed(result.data),
  });

  revalidateEntityPaths("contact", id);
  return { success: true };
}

export async function deleteContact(id: string) {
  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const opps: OpportunityIdOnly[] = await tx.opportunity.findMany({ where: { contactId: id }, select: { id: true } });
    if (opps.length > 0) {
      await tx.activity.deleteMany({ where: { opportunityId: { in: opps.map((o) => o.id) } } });
      await tx.opportunity.deleteMany({ where: { contactId: id } });
    }
    await tx.activity.deleteMany({ where: { contactId: id } });
    await tx.lead.updateMany({ where: { contactId: id }, data: { contactId: null } });
    await tx.contact.delete({ where: { id } });
  });
  revalidateEntityPaths("contact");
  return { success: true };
}
