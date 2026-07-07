export function PageHeader({
  title,
  actions,
}: {
  title: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-zinc-900">{title}</h1>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
