import { FormField, FormGrid } from "@/components/Form";
import { Textarea } from "@/components/ui/Input";
import { StageSelect } from "./StageSelect";

export function OpportunityCoreFields({
  stages,
  defaultStageId,
  defaultAmount = "",
  defaultLostReason = "",
}: {
  stages: { id: string; name: string }[];
  defaultStageId?: string;
  defaultAmount?: string;
  defaultLostReason?: string;
}) {
  return (
    <>
      <FormGrid>
        <FormField
          label="Сумма (₽)"
          name="amount"
          type="number"
          placeholder="0"
          defaultValue={defaultAmount}
        />
        <StageSelect stages={stages} defaultValue={defaultStageId} />
      </FormGrid>
      <FormField label="Причина отказа" name="lostReason">
        <Textarea
          name="lostReason"
          rows={3}
          defaultValue={defaultLostReason}
          placeholder="Обязательно при стадии «Проигран»"
        />
      </FormField>
    </>
  );
}
