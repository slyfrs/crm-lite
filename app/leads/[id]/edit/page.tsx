import { prisma } from "@/lib/prisma";
import { FormShell, FormField } from "@/components/Form";
import { PersonFields } from "@/components/form/PersonFields";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Input";
import { LEAD_SOURCES } from "@/lib/constants";
import { notFound } from "next/navigation";
import { updateLead } from "@/app/actions/leads";

export default async function EditLeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) notFound();

  const boundAction = updateLead.bind(null, id);

  return (
    <div>
      <PageHeader title={`Редактировать: ${lead.firstName} ${lead.lastName}`} />
      <FormShell action={boundAction} cancelHref={`/leads/${id}`}>
        <input type="hidden" name="status" value={lead.status} />
        <PersonFields
          defaults={{
            firstName: lead.firstName,
            lastName: lead.lastName,
            email: lead.email ?? "",
            phone: lead.phone ?? "",
          }}
        />
        <FormField label="Компания" name="company" defaultValue={lead.company || ""} />
        <FormField label="Источник" name="source" required>
          <Select name="source" required defaultValue={lead.source}>
            {LEAD_SOURCES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </FormField>
      </FormShell>
    </div>
  );
}
