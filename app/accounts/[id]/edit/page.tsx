import { prisma } from "@/lib/prisma";
import { FormShell, FormField, FormGrid } from "@/components/Form";
import { PageHeader } from "@/components/ui/PageHeader";
import { notFound } from "next/navigation";
import { updateAccount } from "@/app/actions/accounts";

export default async function EditAccountPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const account = await prisma.account.findUnique({ where: { id } });
  if (!account) notFound();

  const boundAction = updateAccount.bind(null, id);

  return (
    <div>
      <PageHeader title={`Редактировать: ${account.name}`} />
      <FormShell action={boundAction} cancelHref={`/accounts/${id}`}>
        <FormField label="Название" name="name" required defaultValue={account.name} />
        <FormGrid>
          <FormField label="Отрасль" name="industry" defaultValue={account.industry || ""} />
          <FormField label="Телефон" name="phone" defaultValue={account.phone || ""} />
        </FormGrid>
        <FormField label="Сайт" name="website" defaultValue={account.website || ""} />
      </FormShell>
    </div>
  );
}
