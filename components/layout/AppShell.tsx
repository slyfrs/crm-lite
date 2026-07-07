import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/layout/Header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 bg-[var(--color-surface)] p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
