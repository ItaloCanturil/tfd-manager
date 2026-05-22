import { cn } from "@/lib/utils";

const toneClassNames = {
  danger: "border-destructive/20 bg-destructive/10 text-destructive",
  neutral: "border-border bg-muted text-muted-foreground",
  success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
  warning: "border-amber-500/20 bg-amber-500/10 text-amber-700",
} as const;

const sizeClassNames = {
  md: "px-4 py-2 text-sm",
  sm: "px-2.5 py-1 text-xs",
} as const;

export function StatusPill({
  label,
  size = "sm",
  tone,
}: {
  label: string;
  size?: "sm" | "md";
  tone: keyof typeof toneClassNames;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-semibold",
        sizeClassNames[size],
        toneClassNames[tone],
      )}
    >
      {label}
    </span>
  );
}
