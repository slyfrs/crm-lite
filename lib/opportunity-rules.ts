import { STAGE_NAMES } from "@/lib/constants";

export function validateWonTransition(
  stageName: string,
  amount: number | null | undefined,
  contactId: string | null | undefined
): string | null {
  if (stageName !== STAGE_NAMES.WON) return null;
  if (!amount) return "Для перевода в «Выигран» укажите сумму сделки";
  if (!contactId) return "Для перевода в «Выигран» привяжите контакт";
  return null;
}

export function validateLostTransition(
  stageName: string,
  lostReason: string | null | undefined
): string | null {
  if (stageName !== STAGE_NAMES.LOST) return null;
  if (!lostReason?.trim()) return "Для перевода в «Проигран» укажите причину отказа";
  return null;
}
