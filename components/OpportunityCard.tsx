import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { StageBadge } from "@/components/Badges";
import { STAGE_NAMES } from "@/lib/constants";
import { cn, formatCurrency, formatPersonName } from "@/lib/utils";

export type OpportunityCardData = {
  id: string;
  name: string;
  amount: number | null;
  lostReason?: string | null;
  stage: { name: string };
  account: { name: string } | null;
  lead?: { firstName: string; lastName: string } | null;
};

function OpportunityCardContent({
  opp,
  linkable,
  onTitleClick,
}: {
  opp: OpportunityCardData;
  linkable: boolean;
  onTitleClick?: (e: React.MouseEvent) => void;
}) {
  const titleClassName = "font-semibold text-zinc-900 mb-1 truncate";

  return (
    <>
      {linkable ? (
        <h3 className={titleClassName}>{opp.name}</h3>
      ) : (
        <Link
          href={`/opportunities/${opp.id}`}
          className={cn(titleClassName, "block hover:text-blue-600 transition-colors")}
          draggable={false}
          onClick={onTitleClick}
        >
          {opp.name}
        </Link>
      )}
      {opp.account && (
        <p className="text-sm text-zinc-500 mb-2 truncate">{opp.account.name}</p>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        <StageBadge stageName={opp.stage.name} />
        {opp.amount != null && (
          <span className="text-sm text-zinc-600">{formatCurrency(opp.amount)}</span>
        )}
      </div>
      {opp.lead && (
        <p className="text-xs text-zinc-400 mt-2 truncate">
          Лид: {formatPersonName(opp.lead.firstName, opp.lead.lastName)}
        </p>
      )}
      {opp.stage.name === STAGE_NAMES.LOST && opp.lostReason && (
        <p className="text-red-600 text-xs mt-2 line-clamp-2">{opp.lostReason}</p>
      )}
    </>
  );
}

export function OpportunityCard({
  opportunity: opp,
  className,
  isDragging = false,
  linkable = true,
  onTitleClick,
}: {
  opportunity: OpportunityCardData;
  className?: string;
  isDragging?: boolean;
  linkable?: boolean;
  onTitleClick?: (e: React.MouseEvent) => void;
}) {
  const card = (
    <Card
      hover={linkable}
      padding="md"
      className={cn(linkable && "h-full", isDragging && "ring-2 ring-blue-300", className)}
    >
      <OpportunityCardContent opp={opp} linkable={linkable} onTitleClick={onTitleClick} />
    </Card>
  );

  if (linkable) {
    return (
      <Link href={`/opportunities/${opp.id}`} className="block">
        {card}
      </Link>
    );
  }

  return card;
}
