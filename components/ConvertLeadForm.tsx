"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { convertLead } from "@/app/actions/convert";
import { convertLeadSchema } from "@/lib/validations";
import { FormField, FormFieldError, FormSection } from "@/components/Form";
import { AccountSelect } from "@/components/form/AccountSelect";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

function parseFormData(formData: FormData) {
  return {
    email: formData.get("email"),
    phone: formData.get("phone"),
    accountMode: formData.get("accountMode"),
    company: formData.get("company"),
    accountId: formData.get("accountId"),
    createOpportunity: formData.get("createOpportunity"),
    opportunityName: formData.get("opportunityName"),
    opportunityAmount: formData.get("opportunityAmount"),
  };
}

function resolveInitialAccountMode(
  company: string,
  accounts: { id: string; name: string }[]
): { mode: "new" | "existing"; accountId: string } {
  const match = accounts.find(
    (a) => a.name.toLowerCase() === company.trim().toLowerCase()
  );
  if (match) return { mode: "existing", accountId: match.id };
  return { mode: "new", accountId: "" };
}

export function ConvertLeadButton({
  leadId,
  leadName,
  isConverted,
  accounts,
  email = "",
  phone = "",
  company = "",
}: {
  leadId: string;
  leadName: string;
  isConverted: boolean;
  accounts: { id: string; name: string }[];
  email?: string;
  phone?: string;
  company?: string;
}) {
  const initial = resolveInitialAccountMode(company, accounts);
  const [showForm, setShowForm] = useState(false);
  const [accountMode, setAccountMode] = useState<"new" | "existing">(initial.mode);
  const [selectedAccountId, setSelectedAccountId] = useState(initial.accountId);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (isConverted) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setFieldErrors(null);
    setGeneralError(null);

    const formData = new FormData(e.currentTarget);
    const parsed = convertLeadSchema.safeParse(parseFormData(formData));

    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const result = await convertLead(leadId, formData);

      if (result.error) {
        if (typeof result.error === "string") {
          setGeneralError(result.error);
        } else {
          setFieldErrors(result.error);
        }
      } else if (result.success) {
        setShowForm(false);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  function switchAccountMode(mode: "new" | "existing") {
    setAccountMode(mode);
    setFieldErrors(null);
    setGeneralError(null);
  }

  function openModal() {
    const resolved = resolveInitialAccountMode(company, accounts);
    setAccountMode(resolved.mode);
    setSelectedAccountId(resolved.accountId);
    setFieldErrors(null);
    setGeneralError(null);
    setShowForm(true);
  }

  function closeModal() {
    setShowForm(false);
    setFieldErrors(null);
    setGeneralError(null);
  }

  return (
    <div>
      <Button variant="success" onClick={openModal}>
        Конвертировать лид
      </Button>

      <Modal
        open={showForm}
        onClose={closeModal}
        title={`Конвертация: ${leadName}`}
        description="Создайте контакт и компанию или привяжите к существующей"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField label="Email" name="email" type="email" required>
            <Input
              name="email"
              type="email"
              defaultValue={email}
              required
              className={cn(fieldErrors?.email && "border-red-500")}
            />
            <FormFieldError messages={fieldErrors?.email} />
          </FormField>
          <FormField label="Телефон" name="phone" type="tel" required>
            <Input
              name="phone"
              type="tel"
              defaultValue={phone}
              required
              className={cn(fieldErrors?.phone && "border-red-500")}
            />
            <FormFieldError messages={fieldErrors?.phone} />
          </FormField>

          <FormSection title="Компания">
            <input type="hidden" name="accountMode" value={accountMode} />
            <div className="flex flex-col gap-2 mb-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="accountModeRadio"
                  checked={accountMode === "new"}
                  onChange={() => switchAccountMode("new")}
                  className="rounded-full"
                />
                Создать новую компанию
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="accountModeRadio"
                  checked={accountMode === "existing"}
                  onChange={() => switchAccountMode("existing")}
                  disabled={accounts.length === 0}
                  className="rounded-full"
                />
                Выбрать существующую
              </label>
            </div>

            {accountMode === "new" ? (
              <FormField label="Название компании" name="company" required>
                <Input
                  name="company"
                  defaultValue={company}
                  required
                  className={cn(fieldErrors?.company && "border-red-500")}
                />
                <FormFieldError messages={fieldErrors?.company} />
              </FormField>
            ) : (
              <div key={`existing-${selectedAccountId}`}>
                <AccountSelect
                  accounts={accounts}
                  defaultValue={selectedAccountId}
                  required
                />
                <FormFieldError messages={fieldErrors?.accountId} />
              </div>
            )}
          </FormSection>

          <FormSection title="Сделка">
            <label className="flex items-center gap-2 text-sm mb-4">
              <input type="checkbox" name="createOpportunity" className="rounded" />
              Создать сделку
            </label>
            <FormField label="Название сделки" name="opportunityName">
              <Input name="opportunityName" placeholder={`${leadName} — сделка`} />
              <FormFieldError messages={fieldErrors?.opportunityName} />
            </FormField>
            <FormField label="Сумма сделки (₽)" name="opportunityAmount" type="number">
              <Input name="opportunityAmount" type="number" min="0" placeholder="0" />
              <FormFieldError messages={fieldErrors?.opportunityAmount} />
            </FormField>
          </FormSection>

          {generalError && <Alert>{generalError}</Alert>}

          <div className="flex gap-2">
            <Button type="submit" variant="success" disabled={loading}>
              {loading ? "Конвертация..." : "Подтвердить"}
            </Button>
            <Button type="button" variant="secondary" onClick={closeModal} disabled={loading}>
              Отмена
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
