import { cn } from "@/lib/utils";

type BadgeVariant = "brand" | "muted" | "success" | "warning" | "locked" | "dark";

const variantClasses: Record<BadgeVariant, string> = {
  brand: "bg-emerald-100 text-emerald-800",
  muted: "bg-slate-100 text-slate-700",
  success: "bg-lime-100 text-lime-800",
  warning: "bg-amber-100 text-amber-800",
  locked: "bg-white/10 text-white ring-1 ring-white/15",
  dark: "bg-emerald-950/70 text-white ring-1 ring-white/10",
};

export function Badge({
  children,
  variant = "brand",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
