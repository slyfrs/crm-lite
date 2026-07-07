export const LEAD_SOURCES = [
  { value: "site", label: "Сайт", color: "bg-purple-100 text-purple-800" },
  { value: "email", label: "Почта", color: "bg-cyan-100 text-cyan-800" },
  { value: "phone", label: "Телефон", color: "bg-orange-100 text-orange-800" },
  { value: "referral", label: "Рекомендация", color: "bg-emerald-100 text-emerald-800" },
  { value: "manual", label: "Вручную", color: "bg-zinc-100 text-zinc-800" },
] as const;

export const LEAD_STATUSES = [
  { value: "new", label: "Новый", color: "bg-orange-100 text-orange-700", dot: "bg-orange-500" },
  { value: "converted", label: "Обработан", color: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
] as const;

export const STAGE_NAMES = {
  NEW: "Новый",
  WON: "Выигран",
  LOST: "Проигран",
} as const;

export const STAGE_COLORS: Record<string, string> = {
  Новый: "bg-zinc-100 text-zinc-700",
  Выигран: "bg-green-100 text-green-800",
  Проигран: "bg-red-100 text-red-800",
};

export function getSourceLabel(source: string): string {
  return LEAD_SOURCES.find((s) => s.value === source)?.label ?? source;
}

export function getSourceColor(source: string): string {
  return LEAD_SOURCES.find((s) => s.value === source)?.color ?? "bg-zinc-100 text-zinc-800";
}

export function getStatusLabel(status: string): string {
  return LEAD_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export function getStatusColor(status: string): string {
  return LEAD_STATUSES.find((s) => s.value === status)?.color ?? "bg-zinc-100 text-zinc-800";
}

export function getStageColor(stageName: string): string {
  return STAGE_COLORS[stageName] ?? "bg-zinc-100 text-zinc-700";
}

export function isLeadConverted(lead: { status: string; accountId?: string | null }): boolean {
  return lead.status === "converted" || !!lead.accountId;
}
