import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { FilterSelect } from "@/components/SearchFilter";
import { LeadCard } from "@/components/LeadCard";
import { EntityListLayout } from "@/components/layout/EntityListLayout";
import { StatusSummaryBar } from "@/components/StatusSummaryBar";
import { LEAD_SOURCES, LEAD_STATUSES } from "@/lib/constants";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; source?: string; status?: string }>;
}) {
  const { q, source, status } = await searchParams;

  const where: Prisma.LeadWhereInput = {};
  if (q) {
    where.OR = [
      { firstName: { contains: q, mode: "insensitive" } },
      { lastName: { contains: q, mode: "insensitive" } },
      { company: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }
  if (source) where.source = source;
  if (status) where.status = status;

  const [leads, statusCounts, withDealCount] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { account: true, opportunity: { select: { id: true } } },
    }),
    prisma.lead.groupBy({ by: ["status"], _count: true }),
    prisma.lead.count({ where: { opportunity: { some: {} } } }),
  ]);

  const counts = {
    new: statusCounts.find((s) => s.status === "new")?._count ?? 0,
    converted: statusCounts.find((s) => s.status === "converted")?._count ?? 0,
    withDeal: withDealCount,
  };

  return (
    <EntityListLayout
      title="Лиды"
      createHref="/leads/new"
      createLabel="+ Новый лид"
      searchPlaceholder="Поиск по имени, компании, email..."
      filters={
        <>
          <FilterSelect
            name="status"
            label="Все статусы"
            options={LEAD_STATUSES.map((s) => ({ value: s.value, label: s.label }))}
          />
          <FilterSelect
            name="source"
            label="Все источники"
            options={LEAD_SOURCES.map((s) => ({ value: s.value, label: s.label }))}
          />
        </>
      }
      beforeContent={<StatusSummaryBar counts={counts} />}
      emptyMessage="Лидов пока нет."
      isEmpty={leads.length === 0}
    >
      {leads.map((lead) => (
        <LeadCard key={lead.id} lead={lead} />
      ))}
    </EntityListLayout>
  );
}
