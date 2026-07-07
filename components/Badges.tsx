import { Badge } from "@/components/ui/Badge";
import {
  getSourceColor,
  getSourceLabel,
  getStatusColor,
  getStatusLabel,
  getStageColor,
} from "@/lib/constants";

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={getStatusColor(status)}>{getStatusLabel(status)}</Badge>
  );
}

export function SourceBadge({ source }: { source: string }) {
  return (
    <Badge className={getSourceColor(source)}>{getSourceLabel(source)}</Badge>
  );
}

export function StageBadge({ stageName }: { stageName: string }) {
  return (
    <Badge className={getStageColor(stageName)}>{stageName}</Badge>
  );
}
