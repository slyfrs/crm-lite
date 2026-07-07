import { prisma } from "@/lib/prisma";
import { AccountOverviewCard } from "@/components/EntityOverview";
import { DetailPageActions } from "@/components/DetailPageActions";
import { deleteAccountBound } from "@/app/actions/delete";
import { PageHeader } from "@/components/ui/PageHeader";
import { notFound } from "next/navigation";

export default async function AccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const account = await prisma.account.findUnique({
    where: { id },
    include: {
      contacts: true,
      opportunities: { include: { stage: true } },
    },
  });

  if (!account) notFound();

  return (
    <div>
      <PageHeader
        title={account.name}
        actions={
          <DetailPageActions
            editHref={`/accounts/${account.id}/edit`}
            deleteAction={deleteAccountBound}
            deleteEntityName="компанию"
            entityId={account.id}
          />
        }
      />

      <AccountOverviewCard
        industry={account.industry}
        website={account.website}
        phone={account.phone}
        createdAt={account.createdAt}
        contacts={account.contacts}
        opportunities={account.opportunities}
      />
    </div>
  );
}
