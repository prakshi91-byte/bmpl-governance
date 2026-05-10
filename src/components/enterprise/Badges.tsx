import { cn } from "@/lib/utils";
import type { StandardizationStatus } from "@/data/repo";

const TONE: Record<string, { bg: string; fg: string; label: string }> = {
  "YES/Global":      { bg: "bg-std-global-bg",   fg: "text-std-global",   label: "Global" },
  "YES/Option":      { bg: "bg-std-option-bg",   fg: "text-std-option",   label: "Option" },
  "YES/Comp":        { bg: "bg-std-option-bg",   fg: "text-std-option",   label: "Compatible" },
  "YES":             { bg: "bg-std-global-bg",   fg: "text-std-global",   label: "Yes" },
  "LEG Country Specific": { bg: "bg-std-legacy-bg", fg: "text-std-legacy", label: "Legacy / Country" },
  "NO/EntSpec":      { bg: "bg-std-legacy-bg",   fg: "text-std-legacy",   label: "Entity-specific" },
  "Phase Out":       { bg: "bg-std-phaseout-bg", fg: "text-std-phaseout", label: "Phase Out" },
  "NO/PhseOut":      { bg: "bg-std-phaseout-bg", fg: "text-std-phaseout", label: "Phase Out" },
  "No More Used":    { bg: "bg-std-retired-bg",  fg: "text-std-retired",  label: "Retired" },
  "(blank)":         { bg: "bg-std-retired-bg",  fg: "text-std-retired",  label: "—" },
  "Unknown":         { bg: "bg-std-retired-bg",  fg: "text-std-retired",  label: "Unknown" },
};

export function StandardizationBadge({ value, className }: { value: StandardizationStatus; className?: string }) {
  const tone = TONE[value] ?? { bg: "bg-muted", fg: "text-muted-foreground", label: value || "—" };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium leading-4 ring-1 ring-inset ring-border/60",
        tone.bg,
        tone.fg,
        className,
      )}
      title={value}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {tone.label}
    </span>
  );
}

export function StatusBadge({
  value,
  intent = "neutral",
  className,
}: {
  value: string;
  intent?: "neutral" | "info" | "success" | "warn" | "danger";
  className?: string;
}) {
  const map = {
    neutral: "bg-muted text-muted-foreground ring-border/60",
    info: "bg-std-option-bg text-std-option ring-std-option/20",
    success: "bg-std-global-bg text-std-global ring-std-global/20",
    warn: "bg-std-legacy-bg text-std-legacy ring-std-legacy/20",
    danger: "bg-std-phaseout-bg text-std-phaseout ring-std-phaseout/20",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-medium leading-4 ring-1 ring-inset",
        map[intent],
        className,
      )}
    >
      {value}
    </span>
  );
}
