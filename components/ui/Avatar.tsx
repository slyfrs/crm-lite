import { cn, getInitials } from "@/lib/utils";

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-cyan-500",
];

function colorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function Avatar({
  firstName,
  lastName,
  size = "md",
  className,
}: {
  firstName: string;
  lastName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClass = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base" }[size];
  const name = `${firstName}${lastName}`;

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold text-white shrink-0",
        sizeClass,
        colorFromName(name),
        className
      )}
    >
      {getInitials(firstName, lastName)}
    </div>
  );
}
