import { FormField } from "@/components/Form";
import { Select } from "@/components/ui/Input";

export function StageSelect({
  stages,
  defaultValue,
  required = true,
}: {
  stages: { id: string; name: string }[];
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <FormField label="Стадия" name="stageId" required={required}>
      <Select name="stageId" required={required} defaultValue={defaultValue}>
        {stages.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </Select>
    </FormField>
  );
}
