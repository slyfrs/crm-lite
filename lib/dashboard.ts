import { prisma } from "./prisma";
import { STAGE_NAMES } from "./constants";
import type {
  LeadGroupBySource,
  LeadGroupByStatus,
  OverdueTaskWithRelations,
  StageWithOpportunityAmounts,
} from "./prisma-types";

export async function getDashboardData() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [
    totalLeads,
    totalOpportunities,
    openOpportunitiesSum,
    overdueTasks,
    leadsByStatus,
    leadsBySource,
    opportunitiesByStage,
    recentLeads,
    overdueTasksList,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.opportunity.count(),
    prisma.opportunity.aggregate({
      where: { stage: { name: STAGE_NAMES.NEW } },
      _sum: { amount: true },
    }),
    prisma.activity.count({
      where: { type: "task", done: false, dueDate: { lt: today } },
    }),
    prisma.lead.groupBy({ by: ["status"], _count: { id: true } }),
    prisma.lead.groupBy({ by: ["source"], _count: { id: true } }),
    prisma.stage.findMany({
      orderBy: { position: "asc" },
      include: {
        _count: { select: { opportunities: true } },
        opportunities: { select: { amount: true } },
      },
    }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.activity.findMany({
      where: { type: "task", done: false, dueDate: { lt: today } },
      orderBy: { dueDate: "asc" },
      include: { lead: true, opportunity: true },
    }),
  ]);

  const typedLeadsByStatus = leadsByStatus as LeadGroupByStatus[];
  const typedLeadsBySource = leadsBySource as LeadGroupBySource[];
  const typedOpportunitiesByStage = opportunitiesByStage as StageWithOpportunityAmounts[];
  const typedOverdueTasksList = overdueTasksList as OverdueTaskWithRelations[];

  return {
    kpi: {
      totalLeads,
      totalOpportunities,
      openOpportunitiesSum: openOpportunitiesSum._sum.amount || 0,
      overdueTasks,
    },
    leadsByStatus: typedLeadsByStatus.map((s) => ({
      status: s.status,
      count: s._count.id,
    })),
    leadsBySource: typedLeadsBySource.map((s) => ({
      source: s.source,
      count: s._count.id,
    })),
    opportunitiesByStage: typedOpportunitiesByStage.map((s) => ({
      stage: s.name,
      count: s._count.opportunities,
      totalAmount: s.opportunities.reduce((sum, o) => sum + (o.amount || 0), 0),
    })),
    recentLeads,
    overdueTasksList: typedOverdueTasksList,
  };
}

export type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;
