import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { StageListItem } from "@/lib/prisma-types";
import { FormShell, FormField } from "@/components/Form";
import { LeadSelect } from "@/components/form/LeadSelect";
import { OpportunityCoreFields } from "@/components/form/OpportunityCoreFields";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { STAGE_NAMES } from "@/lib/constants";
import { createOpportunity } from "@/app/actions/opportunities";

export default async function NewOpportunityPage() {
  const [stagesRaw, convertedLeads] = await Promise.all([
    prisma.stage.findMany({ orderBy: { position: "asc" } }),
    prisma.lead.findMany({
      where: {
        status: "converted",
        accountId: { not: null },
        contactId: { not: null },
      },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      include: { account: true },
    }),
  ]);

  const stages = stagesRaw as StageListItem[];

  const defaultStageId = stages.find((s) => s.name === STAGE_NAMES.NEW)?.id ?? stages[0]?.id;

  return (
    <div>
      <PageHeader title="Новая сделка" />

      {convertedLeads.length === 0 ? (
        <Card padding="lg" className="max-w-2xl">
          <p className="text-sm text-zinc-500 mb-4">
            Нет конвертированных лидов. Сначала конвертируйте лид — компания и контакт подтянутся автоматически.
          </p>
          <Link href="/leads">
            <Button variant="secondary">Перейти к лидам</Button>
          </Link>
        </Card>
      ) : (
        <FormShell
          action={createOpportunity}
          cancelHref="/opportunities"
          description="Сделка будет связана с компанией и контактом выбранного лида"
          submitLabel="Создать сделку"
        >
          <LeadSelect leads={convertedLeads} />
          <FormField label="Название" name="name" required />
          <OpportunityCoreFields stages={stages} defaultStageId={defaultStageId} />
        </FormShell>
      )}
    </div>
  );
}
