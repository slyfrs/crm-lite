import { prisma } from "@/lib/prisma";
import { ContactOverviewCard } from "@/components/EntityOverview";
import { DetailPageActions } from "@/components/DetailPageActions";
import { deleteContactBound } from "@/app/actions/delete";
import { PageHeader } from "@/components/ui/PageHeader";
import { formatPersonName } from "@/lib/utils";
import { notFound } from "next/navigation";

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contact = await prisma.contact.findUnique({
    where: { id },
    include: {
      account: true,
      opportunities: { include: { stage: true } },
    },
  });

  if (!contact) notFound();

  return (
    <div>
      <PageHeader
        title={formatPersonName(contact.firstName, contact.lastName)}
        actions={
          <DetailPageActions
            editHref={`/contacts/${contact.id}/edit`}
            deleteAction={deleteContactBound}
            deleteEntityName="контакт"
            entityId={contact.id}
          />
        }
      />

      <ContactOverviewCard
        email={contact.email}
        phone={contact.phone}
        jobTitle={contact.jobTitle}
        createdAt={contact.createdAt}
        account={contact.account}
        opportunities={contact.opportunities}
      />
    </div>
  );
}
