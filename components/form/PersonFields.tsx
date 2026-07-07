import { FormField, FormGrid } from "@/components/Form";

export function PersonFields({
  defaults = {},
}: {
  defaults?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
}) {
  return (
    <FormGrid>
      <FormField
        label="Имя"
        name="firstName"
        required
        defaultValue={defaults.firstName}
      />
      <FormField
        label="Фамилия"
        name="lastName"
        required
        defaultValue={defaults.lastName}
      />
      <FormField
        label="Email"
        name="email"
        type="email"
        defaultValue={defaults.email ?? ""}
      />
      <FormField
        label="Телефон"
        name="phone"
        defaultValue={defaults.phone ?? ""}
      />
    </FormGrid>
  );
}
