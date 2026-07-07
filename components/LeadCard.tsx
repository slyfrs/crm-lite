import Link from "next/link";
import { Mail, Phone, MoreVertical } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge, SourceBadge } from "@/components/Badges";
import { formatRelativeDate } from "@/lib/utils";

export function LeadCard({
  lead,
}: {
  lead: {
    id: string;
    firstName: string;
    lastName: string;
    company: string | null;
    email: string | null;
    phone: string | null;
    source: string;
    status: string;
    createdAt: Date;
  };
}) {
  return (
    <Link href={`/leads/${lead.id}`} className="block group">
      <Card hover padding="md" className="h-full group-hover:border-blue-200">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar firstName={lead.firstName} lastName={lead.lastName} />
            <div className="min-w-0">
              <h3 className="font-semibold text-zinc-900 truncate">
                {lead.firstName} {lead.lastName}
              </h3>
              <p className="text-xs text-zinc-400">{formatRelativeDate(lead.createdAt)}</p>
            </div>
          </div>
          <MoreVertical className="w-4 h-4 text-zinc-300 shrink-0" />
        </div>

        {lead.company && (
          <p className="text-sm text-zinc-500 mb-2 truncate">{lead.company}</p>
        )}

        <div className="space-y-1.5 mb-3">
          {lead.phone && (
            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span className="truncate">{lead.phone}</span>
            </div>
          )}
          {lead.email && (
            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span className="truncate">{lead.email}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-zinc-100">
          <SourceBadge source={lead.source} />
          <StatusBadge status={lead.status} />
        </div>
      </Card>
    </Link>
  );
}
