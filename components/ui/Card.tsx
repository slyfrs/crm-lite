import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  padding = "md",
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}) {
  const paddingClass = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  }[padding];

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-[var(--color-border)]",
        "shadow-[var(--shadow-card)]",
        paddingClass,
        hover && "transition-shadow hover:shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
}
