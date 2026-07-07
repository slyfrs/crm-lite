import { FormField } from "@/components/Form";
import { Select } from "@/components/ui/Input";
import { formatPersonName } from "@/lib/utils";

type ConvertedLead = {
  id: string;
  firstName: string;
  lastName: string;
  account: { name: string } | null;
};

export function LeadSelect({
  leads,
  defaultValue = "",
}: {
  leads: ConvertedLead[];
  defaultValue?: string;
}) {
  return (
    <FormField label="Лид" name="leadId" required>
      <Select name="leadId" required defaultValue={defaultValue}>
        <option value="">Выберите лида</option>
        {leads.map((lead) => (
          <option key={lead.id} value={lead.id}>
            {formatPersonName(lead.firstName, lead.lastName)}
            {lead.account ? ` — ${lead.account.name}` : ""}
          </option>
        ))}
      </Select>
    </FormField>
  );
}
