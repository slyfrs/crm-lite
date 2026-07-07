import { FormField } from "@/components/Form";
import { Select } from "@/components/ui/Input";
import { formatPersonName } from "@/lib/utils";

export function ContactSelect({
  contacts,
  defaultValue = "",
}: {
  contacts: { id: string; firstName: string; lastName: string }[];
  defaultValue?: string;
}) {
  return (
    <FormField label="Контакт" name="contactId">
      <Select name="contactId" defaultValue={defaultValue}>
        <option value="">Без контакта</option>
        {contacts.map((c) => (
          <option key={c.id} value={c.id}>
            {formatPersonName(c.firstName, c.lastName)}
          </option>
        ))}
      </Select>
    </FormField>
  );
}
