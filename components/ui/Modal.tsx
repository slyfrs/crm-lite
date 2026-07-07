"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <Card padding="lg">
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          {description && <p className="text-sm text-zinc-500 mb-4">{description}</p>}
          {children}
        </Card>
      </div>
    </div>
  );
}

export function ModalActions({
  confirmLabel,
  onConfirm,
  onCancel,
  loading = false,
  confirmVariant = "primary",
}: {
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  confirmVariant?: "primary" | "success";
}) {
  return (
    <div className="flex gap-2">
      <Button variant={confirmVariant} onClick={onConfirm} disabled={loading}>
        {loading ? "Сохранение..." : confirmLabel}
      </Button>
      <Button variant="secondary" onClick={onCancel} disabled={loading}>
        Отмена
      </Button>
    </div>
  );
}
