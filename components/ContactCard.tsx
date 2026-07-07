import Link from "next/link";
import { Mail } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";

export function ContactCard({
  contact,
}: {
  contact: {
    id: string;
    firstName: string;
    lastName: string;
    jobTitle: string | null;
    email: string | null;
    account: { name: string } | null;
  };
}) {
  return (
    <Link href={`/contacts/${contact.id}`} className="block">
      <Card hover padding="md" className="h-full">
        <div className="flex items-start gap-3 mb-2">
          <Avatar firstName={contact.firstName} lastName={contact.lastName} />
          <div className="min-w-0">
            <h3 className="font-semibold text-zinc-900 truncate">
              {contact.firstName} {contact.lastName}
            </h3>
            {contact.jobTitle && (
              <p className="text-sm text-zinc-500 truncate">{contact.jobTitle}</p>
            )}
          </div>
        </div>
        {contact.account && (
          <p className="text-sm text-zinc-600 mb-2 truncate">{contact.account.name}</p>
        )}
        {contact.email && (
          <div className="flex items-center gap-2 text-xs text-zinc-400 pt-2 border-t border-zinc-100">
            <Mail className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{contact.email}</span>
          </div>
        )}
      </Card>
    </Link>
  );
}
