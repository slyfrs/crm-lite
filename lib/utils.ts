import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function formatRelativeDate(date: Date): string {
  const now = new Date();
  const d = new Date(date);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round((today.getTime() - target.getTime()) / 86400000);

  const time = d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

  if (diffDays === 0) return `Сегодня ${time}`;
  if (diffDays === 1) return `Вчера ${time}`;
  return formatDate(d);
}

export function formatPersonName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return "—";
  return `${amount.toLocaleString("ru-RU")} ₽`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("ru-RU");
}
