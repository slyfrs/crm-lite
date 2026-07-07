import { prisma } from "@/lib/prisma";
import { LeadOverviewCard } from "@/components/EntityOverview";
import { ConvertLeadButton } from "@/components/ConvertLeadForm";
import { DetailPageActions } from "@/components/DetailPageActions";
import { deleteLeadBound } from "@/app/actions/delete";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/Badges";
import { isLeadConverted } from "@/lib/constants";
import { formatPersonName } from "@/lib/utils";
import { notFound } from "next/navigation";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [lead, accounts] = await Promise.all([
    prisma.lead.findUnique({
      where: { id },
      include: {
        account: true,
        contact: true,
        opportunity: { include: { stage: true } },
      },
    }),
    prisma.account.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!lead) notFound();

  const converted = isLeadConverted(lead);
  const leadName = formatPersonName(lead.firstName, lead.lastName);

  return (
    <div>
      <PageHeader
        title={leadName}
        actions={
          <DetailPageActions
            editHref={`/leads/${lead.id}/edit`}
            deleteAction={deleteLeadBound}
            deleteEntityName="лид"
            entityId={lead.id}
            extra={
              <>
                <StatusBadge status={lead.status} />
                <ConvertLeadButton
                  leadId={lead.id}
                  leadName={leadName}
                  isConverted={converted}
                  accounts={accounts}
                  email={lead.email ?? ""}
                  phone={lead.phone ?? ""}
                  company={lead.company ?? ""}
                />
              </>
            }
          />
        }
      />

      <LeadOverviewCard
        company={lead.company}
        email={lead.email}
        phone={lead.phone}
        source={lead.source}
        status={lead.status}
        createdAt={lead.createdAt}
        account={converted ? lead.account : null}
        contact={converted ? lead.contact : null}
        opportunities={converted ? lead.opportunity : []}
      />

      {!converted && (
        <Card padding="md" className="mb-6 bg-blue-50 border-blue-100">
          <p className="text-sm text-blue-700">
            Лид готов к конвертации. Нажмите «Конвертировать лид», чтобы создать контакт и компанию (или привязать к существующей) и опционально сделку.
          </p>
        </Card>
      )}
    </div>
  );
}
