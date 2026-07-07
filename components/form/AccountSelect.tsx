import { FormField } from "@/components/Form";
import { Select } from "@/components/ui/Input";

export function AccountSelect({
  accounts,
  defaultValue = "",
  required = false,
}: {
  accounts: { id: string; name: string }[];
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <FormField label="Компания" name="accountId">
      <Select name="accountId" defaultValue={defaultValue} required={required}>
        {!required && <option value="">Без компании</option>}
        {required && <option value="">Выберите компанию</option>}
        {accounts.map((acc) => (
          <option key={acc.id} value={acc.id}>
            {acc.name}
          </option>
        ))}
      </Select>
    </FormField>
  );
}
