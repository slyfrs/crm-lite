"use client";

import { Bell, ChevronDown } from "lucide-react";

export function Header() {
  return (
    <header className="h-14 bg-white border-b border-[var(--color-border)] flex items-center justify-end px-6 shrink-0 text-right">
      <div className="flex items-center gap-4 text-right">
        <button type="button" className="relative text-zinc-400 hover:text-zinc-600">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-zinc-200">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-700">
            М
          </div>
          <span className="text-sm font-medium text-zinc-700">Менеджер</span>
          <ChevronDown className="w-4 h-4 text-zinc-400" />
        </div>
      </div>
    </header>
  );
}
