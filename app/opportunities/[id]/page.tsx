import { prisma } from "@/lib/prisma";
import { ActivitiesSection } from "@/components/ActivityForm";
import { OpportunityOverviewCard } from "@/components/EntityOverview";
import { DetailPageActions } from "@/components/DetailPageActions";
import { deleteOpportunityBound } from "@/app/actions/delete";
import { PageHeader } from "@/components/ui/PageHeader";
import { notFound } from "next/navigation";

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const opp = await prisma.opportunity.findUnique({
    where: { id },
    include: {
      stage: true,
      account: true,
      contact: true,
      lead: true,
      activities: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!opp) notFound();

  return (
    <div>
      <PageHeader
        title={opp.name}
        actions={
          <DetailPageActions
            editHref={`/opportunities/${opp.id}/edit`}
            deleteAction={deleteOpportunityBound}
            deleteEntityName="сделку"
            entityId={opp.id}
          />
        }
      />

      <OpportunityOverviewCard
        stageName={opp.stage.name}
        amount={opp.amount}
        createdAt={opp.createdAt}
        lostReason={opp.lostReason}
        account={opp.account}
        contact={opp.contact}
        lead={opp.lead}
      />

      <ActivitiesSection opportunityId={opp.id} activities={opp.activities} />
    </div>
  );
}
