import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AccountCard } from "@/components/AccountCard";
import { EntityListLayout } from "@/components/layout/EntityListLayout";

export default async function AccountsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const where: Prisma.AccountWhereInput = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { industry: { contains: q, mode: "insensitive" } },
    ];
  }

  const accounts = await prisma.account.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { contacts: true, opportunities: true } } },
  });

  return (
    <EntityListLayout
      title="Компании"
      searchPlaceholder="Поиск по названию, отрасли..."
      emptyMessage="Компаний пока нет. Они создаются при конвертации лидов."
      isEmpty={accounts.length === 0}
    >
      {accounts.map((acc) => (
        <AccountCard key={acc.id} account={acc} />
      ))}
    </EntityListLayout>
  );
}
