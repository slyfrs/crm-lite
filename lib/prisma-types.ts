import type { Prisma } from "@prisma/client";

export type LeadGroupByStatus = {
  status: string;
  _count: { id: number };
};

export type LeadGroupBySource = {
  source: string;
  _count: { id: number };
};

export type StageWithOpportunityAmounts = Prisma.StageGetPayload<{
  include: {
    _count: { select: { opportunities: true } };
    opportunities: { select: { amount: true } };
  };
}>;

export type OverdueTaskWithRelations = Prisma.ActivityGetPayload<{
  include: { lead: true; opportunity: true };
}>;

export type AccountWithRelations = Prisma.AccountGetPayload<{
  include: { opportunities: true; contacts: true };
}>;

export type OpportunityIdOnly = Prisma.OpportunityGetPayload<{ select: { id: true } }>;

export type StageListItem = Prisma.StageGetPayload<Record<string, never>>;
