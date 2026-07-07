import { cn } from "@/lib/utils";

export function StatusSummaryBar({
  counts,
}: {
  counts: { new: number; converted: number; withDeal: number };
}) {
  const items = [
    { label: "Новый", count: counts.new, dot: "bg-orange-500" },
    { label: "Обработан", count: counts.converted, dot: "bg-blue-500" },
    { label: "Со сделкой", count: counts.withDeal, dot: "bg-cyan-500" },
  ];

  return (
    <div className="flex items-center gap-6 mb-6 py-3 px-4 bg-white rounded-xl border border-[var(--color-border)]">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span className={cn("w-2 h-2 rounded-full", item.dot)} />
          <span className="text-sm text-zinc-600">{item.label}</span>
          <span className="text-sm font-semibold text-zinc-900">
            {item.count} {item.count === 1 ? "лид" : item.count < 5 ? "лида" : "лидов"}
          </span>
        </div>
      ))}
    </div>
  );
}
