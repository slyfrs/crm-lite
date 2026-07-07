import Link from "next/link";
import { Building2 } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function AccountCard({
  account,
}: {
  account: {
    id: string;
    name: string;
    industry: string | null;
    _count: { contacts: number; opportunities: number };
  };
}) {
  return (
    <Link href={`/accounts/${account.id}`} className="block">
      <Card hover padding="md" className="h-full">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-zinc-900 truncate">{account.name}</h3>
            {account.industry && (
              <p className="text-sm text-zinc-500 truncate">{account.industry}</p>
            )}
          </div>
        </div>
        <div className="flex gap-4 text-xs text-zinc-400 pt-2 border-t border-zinc-100">
          <span>{account._count.contacts} контактов</span>
          <span>{account._count.opportunities} сделок</span>
        </div>
      </Card>
    </Link>
  );
}
