"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import type { ActionResult } from "@/lib/action-utils";

export function DeleteButton({
  entityName,
  action,
  entityId,
}: {
  entityName: string;
  action: (formData: FormData) => Promise<ActionResult>;
  entityId: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.set("id", entityId);
    const result = await action(formData);
    if (result.error) {
      setError(typeof result.error === "string" ? result.error : "Не удалось удалить");
      setLoading(false);
    } else {
      router.back();
    }
  }

  if (!confirming) {
    return (
      <Button variant="ghost" size="sm" onClick={() => setConfirming(true)} className="text-red-600 hover:bg-red-50">
        Удалить
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-red-600">Удалить {entityName}?</span>
      <Button variant="danger" size="sm" onClick={handleDelete} disabled={loading}>
        {loading ? "Удаление..." : "Да, удалить"}
      </Button>
      <Button variant="secondary" size="sm" onClick={() => setConfirming(false)}>
        Отмена
      </Button>
      {error && <p className="text-red-600 text-xs w-full">{error}</p>}
    </div>
  );
}
