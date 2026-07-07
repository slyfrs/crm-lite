"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { moveOpportunityStage } from "@/app/actions/stages";
import { OpportunityCard } from "@/components/OpportunityCard";
import { Alert } from "@/components/ui/Alert";
import { Input, Textarea } from "@/components/ui/Input";
import { Modal, ModalActions } from "@/components/ui/Modal";
import { STAGE_NAMES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { StageBadge } from "@/components/Badges";

type Opportunity = {
  id: string;
  name: string;
  amount: number | null;
  stageId: string;
  lostReason: string | null;
  account: { name: string } | null;
  lead: { firstName: string; lastName: string } | null;
};

type StageColumn = {
  id: string;
  name: string;
  opportunities: Opportunity[];
};

type PendingLostMove = {
  opportunityId: string;
  fromStageId: string;
  toStageId: string;
  opportunityName: string;
};

type PendingWonMove = {
  opportunityId: string;
  fromStageId: string;
  toStageId: string;
  opportunityName: string;
};

export function PipelineBoard({ stages: initialStages }: { stages: StageColumn[] }) {
  const [optimisticColumns, setOptimisticColumns] = useState<StageColumn[] | null>(null);
  const [prevInitialStages, setPrevInitialStages] = useState(initialStages);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [moving, setMoving] = useState(false);
  const [pendingLost, setPendingLost] = useState<PendingLostMove | null>(null);
  const [lostReasonInput, setLostReasonInput] = useState("");
  const [lostError, setLostError] = useState<string | null>(null);
  const [pendingWon, setPendingWon] = useState<PendingWonMove | null>(null);
  const [amountInput, setAmountInput] = useState("");
  const [amountError, setAmountError] = useState<string | null>(null);
  const router = useRouter();

  if (initialStages !== prevInitialStages) {
    setPrevInitialStages(initialStages);
    setOptimisticColumns(null);
  }

  const columns = optimisticColumns ?? initialStages;

  function moveOptimistic(
    opportunityId: string,
    fromStageId: string,
    toStageId: string,
    amount?: number
  ) {
    setOptimisticColumns((prev) => {
      const base = prev ?? initialStages;
      const next = base.map((col) => ({
        ...col,
        opportunities: [...col.opportunities],
      }));

      const fromCol = next.find((col) => col.id === fromStageId);
      const toCol = next.find((col) => col.id === toStageId);
      if (!fromCol || !toCol) return prev ?? base;

      const index = fromCol.opportunities.findIndex((opp) => opp.id === opportunityId);
      if (index === -1) return prev ?? base;

      const [opp] = fromCol.opportunities.splice(index, 1);
      toCol.opportunities.unshift({
        ...opp,
        stageId: toStageId,
        ...(amount != null && { amount }),
      });

      return next;
    });
  }

  async function executeMove(
    opportunityId: string,
    fromStageId: string,
    toStageId: string,
    opts?: { lostReason?: string; amount?: number }
  ) {
    setDraggingId(null);
    setDropTargetId(null);
    setError(null);
    setMoving(true);
    moveOptimistic(opportunityId, fromStageId, toStageId, opts?.amount);

    const result = await moveOpportunityStage(
      opportunityId,
      toStageId,
      opts?.lostReason,
      opts?.amount
    );
    setMoving(false);

    if (result.error) {
      setError(result.error);
      setOptimisticColumns(null);
    }

    router.refresh();
  }

  function handleDrop(opportunityId: string, fromStageId: string, toStageId: string) {
    if (fromStageId === toStageId || moving) return;

    const toStage = columns.find((col) => col.id === toStageId);
    const opp = columns.flatMap((col) => col.opportunities).find((o) => o.id === opportunityId);

    if (toStage?.name === STAGE_NAMES.LOST) {
      setDraggingId(null);
      setDropTargetId(null);
      setPendingLost({
        opportunityId,
        fromStageId,
        toStageId,
        opportunityName: opp?.name ?? "Сделка",
      });
      setLostReasonInput(opp?.lostReason ?? "");
      setLostError(null);
      return;
    }

    if (toStage?.name === STAGE_NAMES.WON && !opp?.amount) {
      setDraggingId(null);
      setDropTargetId(null);
      setPendingWon({
        opportunityId,
        fromStageId,
        toStageId,
        opportunityName: opp?.name ?? "Сделка",
      });
      setAmountInput("");
      setAmountError(null);
      return;
    }

    executeMove(opportunityId, fromStageId, toStageId);
  }

  async function confirmLostMove() {
    if (!pendingLost) return;
    if (!lostReasonInput.trim()) {
      setLostError("Укажите причину отказа");
      return;
    }
    const { opportunityId, fromStageId, toStageId } = pendingLost;
    setPendingLost(null);
    await executeMove(opportunityId, fromStageId, toStageId, {
      lostReason: lostReasonInput.trim(),
    });
  }

  async function confirmWonMove() {
    if (!pendingWon) return;
    const parsed = Number(amountInput.replace(/\s/g, "").replace(",", "."));
    if (!amountInput.trim() || Number.isNaN(parsed) || parsed <= 0) {
      setAmountError("Укажите сумму сделки");
      return;
    }
    const { opportunityId, fromStageId, toStageId } = pendingWon;
    setPendingWon(null);
    await executeMove(opportunityId, fromStageId, toStageId, { amount: parsed });
  }

  return (
    <div>
      {error && (
        <Alert className="mb-4">{error}</Alert>
      )}

      <Modal
        open={!!pendingWon}
        onClose={() => {
          setPendingWon(null);
          setAmountInput("");
          setAmountError(null);
        }}
        title="Сумма сделки"
        description={
          pendingWon
            ? `Для перевода «${pendingWon.opportunityName}» в «Выигран»`
            : undefined
        }
      >
        <Input
          type="number"
          min={0}
          step="0.01"
          value={amountInput}
          onChange={(e) => {
            setAmountInput(e.target.value);
            setAmountError(null);
          }}
          placeholder="0"
          className="mb-2"
          autoFocus
        />
        {amountError && <p className="text-red-600 text-sm mb-3">{amountError}</p>}
        <ModalActions
          confirmLabel="Подтвердить"
          onConfirm={confirmWonMove}
          onCancel={() => {
            setPendingWon(null);
            setAmountInput("");
            setAmountError(null);
          }}
          loading={moving}
        />
      </Modal>

      <Modal
        open={!!pendingLost}
        onClose={() => {
          setPendingLost(null);
          setLostReasonInput("");
          setLostError(null);
        }}
        title="Причина отказа"
        description={
          pendingLost
            ? `Для перевода «${pendingLost.opportunityName}» в «Проигран»`
            : undefined
        }
      >
        <Textarea
          value={lostReasonInput}
          onChange={(e) => {
            setLostReasonInput(e.target.value);
            setLostError(null);
          }}
          rows={3}
          placeholder="Например: выбрали другого подрядчика"
          className="mb-2"
          autoFocus
        />
        {lostError && <p className="text-red-600 text-sm mb-3">{lostError}</p>}
        <ModalActions
          confirmLabel="Подтвердить"
          onConfirm={confirmLostMove}
          onCancel={() => {
            setPendingLost(null);
            setLostReasonInput("");
            setLostError(null);
          }}
          loading={moving}
        />
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((stage) => (
          <div
            key={stage.id}
            onDragOver={(e) => {
              e.preventDefault();
              setDropTargetId(stage.id);
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setDropTargetId(null);
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDropTargetId(null);
              setDraggingId(null);
              const opportunityId = e.dataTransfer.getData("opportunityId");
              const fromStageId = e.dataTransfer.getData("fromStageId");
              if (opportunityId && fromStageId) {
                handleDrop(opportunityId, fromStageId, stage.id);
              }
            }}
            className={cn(
              "bg-zinc-100/80 rounded-xl p-3 min-h-[200px] transition-shadow",
              dropTargetId === stage.id && "ring-2 ring-blue-400 ring-offset-2"
            )}
          >
            <h2 className="font-semibold text-sm text-zinc-700 mb-3 px-1 flex items-center gap-2">
              <StageBadge stageName={stage.name} />
              <span className="text-zinc-400 font-normal">({stage.opportunities.length})</span>
            </h2>

            <div className="space-y-2">
              {stage.opportunities.map((opp) => (
                <div
                  key={opp.id}
                  draggable={!moving}
                  onDragStart={(e: React.DragEvent) => {
                    e.dataTransfer.setData("opportunityId", opp.id);
                    e.dataTransfer.setData("fromStageId", stage.id);
                    e.dataTransfer.effectAllowed = "move";
                    setDraggingId(opp.id);
                  }}
                  onDragEnd={() => setDraggingId(null)}
                  className={cn(
                    "cursor-grab active:cursor-grabbing select-none",
                    draggingId === opp.id && "opacity-50"
                  )}
                >
                  <OpportunityCard
                    opportunity={{
                      ...opp,
                      stage: { name: stage.name },
                    }}
                    linkable={false}
                    isDragging={draggingId === opp.id}
                    onTitleClick={(e) => {
                      if (draggingId) e.preventDefault();
                    }}
                  />
                </div>
              ))}

              {stage.opportunities.length === 0 && (
                <p className="text-zinc-400 text-xs px-1 py-6 text-center border border-dashed border-zinc-200 rounded-lg">
                  Перетащите сделку сюда
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
