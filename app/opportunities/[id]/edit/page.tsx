import { prisma } from "@/lib/prisma";
import { FormShell, FormField, FormGrid, FormSection } from "@/components/Form";
import { AccountSelect } from "@/components/form/AccountSelect";
import { ContactSelect } from "@/components/form/ContactSelect";
import { OpportunityCoreFields } from "@/components/form/OpportunityCoreFields";
import { PageHeader } from "@/components/ui/PageHeader";
import { notFound } from "next/navigation";
import { updateOpportunity } from "@/app/actions/opportunities";

export default async function EditOpportunityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const opp = await prisma.opportunity.findUnique({ where: { id } });
  const [stages, accounts, contacts] = await Promise.all([
    prisma.stage.findMany({ orderBy: { position: "asc" } }),
    prisma.account.findMany({ orderBy: { name: "asc" } }),
    prisma.contact.findMany({ orderBy: { firstName: "asc" } }),
  ]);
  if (!opp) notFound();

  const boundAction = updateOpportunity.bind(null, id);

  return (
    <div>
      <PageHeader title={`Редактировать: ${opp.name}`} />
      <FormShell action={boundAction} cancelHref={`/opportunities/${id}`}>
        <FormField label="Название" name="name" required defaultValue={opp.name} />
        <OpportunityCoreFields
          stages={stages}
          defaultStageId={opp.stageId}
          defaultAmount={opp.amount?.toString() || ""}
          defaultLostReason={opp.lostReason || ""}
        />
        <FormSection title="Связи">
          <FormGrid>
            <AccountSelect accounts={accounts} defaultValue={opp.accountId || ""} />
            <ContactSelect contacts={contacts} defaultValue={opp.contactId || ""} />
          </FormGrid>
        </FormSection>
      </FormShell>
    </div>
  );
}
