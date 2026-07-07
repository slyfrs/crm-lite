import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block px-2 py-0.5 rounded-md text-xs font-medium",
        className
      )}
    >
      {children}
    </span>
  );
}
