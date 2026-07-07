import { FormShell, FormField } from "@/components/Form";
import { PersonFields } from "@/components/form/PersonFields";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Input";
import { LEAD_SOURCES } from "@/lib/constants";
import { createLead } from "@/app/actions/leads";

export default function NewLeadPage() {
  return (
    <div>
      <PageHeader title="Новый лид" />
      <FormShell
        action={createLead}
        cancelHref="/leads"
        description="Заполните данные входящего запроса"
        submitLabel="Создать лид"
      >
        <PersonFields />
        <FormField label="Компания" name="company" />
        <FormField label="Источник" name="source" required>
          <Select name="source" required defaultValue="">
            <option value="">Выберите источник</option>
            {LEAD_SOURCES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </FormField>
      </FormShell>
    </div>
  );
}
