import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { FilterSelect } from "@/components/SearchFilter";
import { OpportunityCard } from "@/components/OpportunityCard";
import { EntityListLayout } from "@/components/layout/EntityListLayout";

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; stageId?: string }>;
}) {
  const { q, stageId } = await searchParams;

  const where: Prisma.OpportunityWhereInput = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { account: { name: { contains: q, mode: "insensitive" } } },
    ];
  }
  if (stageId) where.stageId = stageId;

  const [opportunities, stages] = await Promise.all([
    prisma.opportunity.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { stage: true, account: true, contact: true, lead: true },
    }),
    prisma.stage.findMany({ orderBy: { position: "asc" } }),
  ]);

  return (
    <EntityListLayout
      title="Сделки"
      createHref="/opportunities/new"
      createLabel="+ Новая сделка"
      searchPlaceholder="Поиск по названию, компании..."
      filters={
        <FilterSelect
          name="stageId"
          label="Все стадии"
          options={stages.map((s) => ({ value: s.id, label: s.name }))}
        />
      }
      emptyMessage="Сделок пока нет. Создайте новую сделку или конвертируйте лид."
      isEmpty={opportunities.length === 0}
    >
      {opportunities.map((opp) => (
        <OpportunityCard key={opp.id} opportunity={opp} />
      ))}
    </EntityListLayout>
  );
}
