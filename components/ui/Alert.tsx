import { cn } from "@/lib/utils";

export function Alert({
  children,
  variant = "error",
  className,
}: {
  children: React.ReactNode;
  variant?: "error";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg p-3 text-sm border",
        variant === "error" && "bg-red-50 border-red-200 text-red-700",
        className
      )}
    >
      {children}
    </div>
  );
}
