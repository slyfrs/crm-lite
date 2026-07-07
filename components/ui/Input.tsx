import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        "placeholder:text-zinc-400",
        className
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm bg-white",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        "placeholder:text-zinc-400 resize-y min-h-[80px]",
        className
      )}
      {...props}
    />
  );
}
