import { prisma } from "@/lib/prisma";
import { FormShell, FormField, FormSection, FormGrid } from "@/components/Form";
import { PersonFields } from "@/components/form/PersonFields";
import { AccountSelect } from "@/components/form/AccountSelect";
import { PageHeader } from "@/components/ui/PageHeader";
import { notFound } from "next/navigation";
import { updateContact } from "@/app/actions/contacts";

export default async function EditContactPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contact = await prisma.contact.findUnique({ where: { id } });
  const accounts = await prisma.account.findMany({ orderBy: { name: "asc" } });
  if (!contact) notFound();

  const boundAction = updateContact.bind(null, id);

  return (
    <div>
      <PageHeader title={`Редактировать: ${contact.firstName} ${contact.lastName}`} />
      <FormShell action={boundAction} cancelHref={`/contacts/${id}`}>
        <PersonFields
          defaults={{
            firstName: contact.firstName,
            lastName: contact.lastName,
            email: contact.email ?? "",
            phone: contact.phone ?? "",
          }}
        />
        <FormField label="Должность" name="jobTitle" defaultValue={contact.jobTitle || ""} />
        <FormSection title="Связи">
          <FormGrid>
            <AccountSelect accounts={accounts} defaultValue={contact.accountId || ""} />
          </FormGrid>
        </FormSection>
      </FormShell>
    </div>
  );
}
