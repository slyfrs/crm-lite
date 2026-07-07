import Link from "next/link";
import { DeleteButton } from "@/components/DeleteButton";
import { Button } from "@/components/ui/Button";
import type { ActionResult } from "@/lib/action-utils";

export function DetailPageActions({
  editHref,
  deleteAction,
  deleteEntityName,
  entityId,
  extra,
}: {
  editHref: string;
  deleteAction: (formData: FormData) => Promise<ActionResult>;
  deleteEntityName: string;
  entityId: string;
  extra?: React.ReactNode;
}) {
  return (
    <>
      {extra}
      <Link href={editHref}>
        <Button variant="secondary">Редактировать</Button>
      </Link>
      <DeleteButton entityName={deleteEntityName} action={deleteAction} entityId={entityId} />
    </>
  );
}
