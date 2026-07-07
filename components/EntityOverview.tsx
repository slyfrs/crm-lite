import Link from "next/link";
import {
  Briefcase,
  Building2,
  Calendar,
  Contact,
  Globe,
  Layers,
  Mail,
  MessageSquareX,
  Phone,
  RussianRuble,
  UserPlus,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SourceBadge, StageBadge, StatusBadge } from "@/components/Badges";
import { STAGE_NAMES } from "@/lib/constants";
import { formatCurrency, formatDate, formatPersonName } from "@/lib/utils";

export function InfoItem({
  icon: Icon,
  label,
  children,
  iconClassName = "bg-zinc-100 text-zinc-500",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
  iconClassName?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconClassName}`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-zinc-500 mb-0.5">{label}</p>
        <div className="text-sm font-medium text-zinc-900">{children}</div>
      </div>
    </div>
  );
}

export function RelationItem({
  icon: Icon,
  label,
  href,
  name,
  subtitle,
  iconClassName,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  name: string;
  subtitle?: string | null;
  iconClassName: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg border border-zinc-100 p-3 hover:bg-zinc-50 transition-colors group"
    >
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconClassName}`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-zinc-500">{label}</p>
        <p className="text-sm font-medium text-blue-600 group-hover:underline truncate">
          {name}
        </p>
        {subtitle && <p className="text-xs text-zinc-400 truncate">{subtitle}</p>}
      </div>
    </Link>
  );
}

function EntityRelationsSection({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="border-t border-zinc-100 my-5" />
      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-3">
        Связи
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{children}</div>
    </>
  );
}

function OpportunitiesSection({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="border-t border-zinc-100 my-5" />
      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-3">
        Сделки
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{children}</div>
    </>
  );
}

function OpportunityRelationItem({
  id,
  name,
  stageName,
  amount,
}: {
  id: string;
  name: string;
  stageName: string;
  amount: number | null;
}) {
  return (
    <Link
      href={`/opportunities/${id}`}
      className="flex items-center gap-3 rounded-lg border border-zinc-100 p-3 hover:bg-zinc-50 transition-colors group"
    >
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-indigo-100 text-indigo-600">
        <Briefcase className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-zinc-500">Сделка</p>
        <p className="text-sm font-medium text-blue-600 group-hover:underline truncate">
          {name}
        </p>
        {amount != null && (
          <p className="text-xs text-zinc-400">{formatCurrency(amount)}</p>
        )}
      </div>
      <StageBadge stageName={stageName} />
    </Link>
  );
}

export function OpportunityOverviewCard({
  stageName,
  amount,
  createdAt,
  lostReason,
  account,
  contact,
  lead,
}: {
  stageName: string;
  amount: number | null;
  createdAt: Date;
  lostReason: string | null;
  account: { id: string; name: string } | null;
  contact: { id: string; firstName: string; lastName: string } | null;
  lead: { id: string; firstName: string; lastName: string } | null;
}) {
  const hasRelations = account || contact || lead;

  return (
    <Card padding="lg" className="mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <InfoItem icon={Layers} label="Стадия" iconClassName="bg-violet-100 text-violet-600">
          <StageBadge stageName={stageName} />
        </InfoItem>
        <InfoItem
          icon={RussianRuble}
          label="Сумма"
          iconClassName="bg-emerald-100 text-emerald-600"
        >
          {formatCurrency(amount)}
        </InfoItem>
        <InfoItem icon={Calendar} label="Создана" iconClassName="bg-amber-100 text-amber-600">
          {formatDate(createdAt)}
        </InfoItem>
      </div>

      {stageName === STAGE_NAMES.LOST && lostReason && (
        <>
          <div className="border-t border-zinc-100 my-5" />
          <InfoItem
            icon={MessageSquareX}
            label="Причина отказа"
            iconClassName="bg-red-100 text-red-600"
          >
            {lostReason}
          </InfoItem>
        </>
      )}

      {hasRelations && (
        <EntityRelationsSection>
          {account && (
            <RelationItem
              icon={Building2}
              label="Компания"
              href={`/accounts/${account.id}`}
              name={account.name}
              iconClassName="bg-blue-100 text-blue-600"
            />
          )}
          {contact && (
            <RelationItem
              icon={Contact}
              label="Контакт"
              href={`/contacts/${contact.id}`}
              name={formatPersonName(contact.firstName, contact.lastName)}
              iconClassName="bg-teal-100 text-teal-600"
            />
          )}
          {lead && (
            <RelationItem
              icon={UserPlus}
              label="Лид"
              href={`/leads/${lead.id}`}
              name={formatPersonName(lead.firstName, lead.lastName)}
              iconClassName="bg-orange-100 text-orange-600"
            />
          )}
        </EntityRelationsSection>
      )}
    </Card>
  );
}

export function LeadOverviewCard({
  company,
  email,
  phone,
  source,
  status,
  createdAt,
  account,
  contact,
  opportunities,
}: {
  company: string | null;
  email: string | null;
  phone: string | null;
  source: string;
  status: string;
  createdAt: Date;
  account: { id: string; name: string; industry: string | null } | null;
  contact: { id: string; firstName: string; lastName: string; jobTitle: string | null } | null;
  opportunities: {
    id: string;
    name: string;
    amount: number | null;
    stage: { name: string };
  }[];
}) {
  const hasEntityRelations = account || contact;
  const hasOpportunities = opportunities.length > 0;

  return (
    <Card padding="lg" className="mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <InfoItem icon={Building2} label="Компания" iconClassName="bg-blue-100 text-blue-600">
          {company || "—"}
        </InfoItem>
        <InfoItem icon={Mail} label="Email" iconClassName="bg-cyan-100 text-cyan-600">
          {email || "—"}
        </InfoItem>
        <InfoItem icon={Phone} label="Телефон" iconClassName="bg-orange-100 text-orange-600">
          {phone || "—"}
        </InfoItem>
        <InfoItem icon={UserPlus} label="Источник" iconClassName="bg-purple-100 text-purple-600">
          <SourceBadge source={source} />
        </InfoItem>
        <InfoItem icon={Layers} label="Статус" iconClassName="bg-violet-100 text-violet-600">
          <StatusBadge status={status} />
        </InfoItem>
        <InfoItem icon={Calendar} label="Создан" iconClassName="bg-amber-100 text-amber-600">
          {formatDate(createdAt)}
        </InfoItem>
      </div>

      {hasEntityRelations && (
        <EntityRelationsSection>
          {account && (
            <RelationItem
              icon={Building2}
              label="Компания"
              href={`/accounts/${account.id}`}
              name={account.name}
              subtitle={account.industry}
              iconClassName="bg-blue-100 text-blue-600"
            />
          )}
          {contact && (
            <RelationItem
              icon={Contact}
              label="Контакт"
              href={`/contacts/${contact.id}`}
              name={formatPersonName(contact.firstName, contact.lastName)}
              subtitle={contact.jobTitle}
              iconClassName="bg-teal-100 text-teal-600"
            />
          )}
        </EntityRelationsSection>
      )}

      {hasOpportunities && (
        <OpportunitiesSection>
          {opportunities.map((opp) => (
            <OpportunityRelationItem
              key={opp.id}
              id={opp.id}
              name={opp.name}
              stageName={opp.stage.name}
              amount={opp.amount}
            />
          ))}
        </OpportunitiesSection>
      )}
    </Card>
  );
}

export function AccountOverviewCard({
  industry,
  website,
  phone,
  createdAt,
  contacts,
  opportunities,
}: {
  industry: string | null;
  website: string | null;
  phone: string | null;
  createdAt: Date;
  contacts: { id: string; firstName: string; lastName: string; jobTitle: string | null }[];
  opportunities: {
    id: string;
    name: string;
    amount: number | null;
    stage: { name: string };
  }[];
}) {
  const hasContacts = contacts.length > 0;
  const hasOpportunities = opportunities.length > 0;

  return (
    <Card padding="lg" className="mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <InfoItem icon={Building2} label="Отрасль" iconClassName="bg-blue-100 text-blue-600">
          {industry || "—"}
        </InfoItem>
        <InfoItem icon={Globe} label="Сайт" iconClassName="bg-sky-100 text-sky-600">
          {website ? (
            <a
              href={website}
              className="text-blue-600 hover:underline break-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              {website}
            </a>
          ) : (
            "—"
          )}
        </InfoItem>
        <InfoItem icon={Phone} label="Телефон" iconClassName="bg-orange-100 text-orange-600">
          {phone || "—"}
        </InfoItem>
        <InfoItem icon={Calendar} label="Создана" iconClassName="bg-amber-100 text-amber-600">
          {formatDate(createdAt)}
        </InfoItem>
      </div>

      {hasContacts && (
        <EntityRelationsSection>
          {contacts.map((c) => (
            <RelationItem
              key={c.id}
              icon={Contact}
              label="Контакт"
              href={`/contacts/${c.id}`}
              name={formatPersonName(c.firstName, c.lastName)}
              subtitle={c.jobTitle}
              iconClassName="bg-teal-100 text-teal-600"
            />
          ))}
        </EntityRelationsSection>
      )}

      {hasOpportunities && (
        <OpportunitiesSection>
          {opportunities.map((opp) => (
            <OpportunityRelationItem
              key={opp.id}
              id={opp.id}
              name={opp.name}
              stageName={opp.stage.name}
              amount={opp.amount}
            />
          ))}
        </OpportunitiesSection>
      )}
    </Card>
  );
}

export function ContactOverviewCard({
  email,
  phone,
  jobTitle,
  createdAt,
  account,
  opportunities,
}: {
  email: string | null;
  phone: string | null;
  jobTitle: string | null;
  createdAt: Date;
  account: { id: string; name: string } | null;
  opportunities: {
    id: string;
    name: string;
    amount: number | null;
    stage: { name: string };
  }[];
}) {
  const hasEntityRelations = !!account;
  const hasOpportunities = opportunities.length > 0;

  return (
    <Card padding="lg" className="mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <InfoItem icon={Mail} label="Email" iconClassName="bg-cyan-100 text-cyan-600">
          {email || "—"}
        </InfoItem>
        <InfoItem icon={Phone} label="Телефон" iconClassName="bg-orange-100 text-orange-600">
          {phone || "—"}
        </InfoItem>
        <InfoItem icon={Briefcase} label="Должность" iconClassName="bg-indigo-100 text-indigo-600">
          {jobTitle || "—"}
        </InfoItem>
        <InfoItem icon={Calendar} label="Создан" iconClassName="bg-amber-100 text-amber-600">
          {formatDate(createdAt)}
        </InfoItem>
      </div>

      {hasEntityRelations && account && (
        <EntityRelationsSection>
          <RelationItem
            icon={Building2}
            label="Компания"
            href={`/accounts/${account.id}`}
            name={account.name}
            iconClassName="bg-blue-100 text-blue-600"
          />
        </EntityRelationsSection>
      )}

      {hasOpportunities && (
        <OpportunitiesSection>
          {opportunities.map((opp) => (
            <OpportunityRelationItem
              key={opp.id}
              id={opp.id}
              name={opp.name}
              stageName={opp.stage.name}
              amount={opp.amount}
            />
          ))}
        </OpportunitiesSection>
      )}
    </Card>
  );
}
