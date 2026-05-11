import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import type { ReactNode } from "react";

export function FilterBar({
  search,
  onSearchChange,
  placeholder = "Search…",
  children,
  right,
  className,
}: {
  search?: string;
  onSearchChange?: (v: string) => void;
  placeholder?: string;
  children?: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "sticky top-0 z-10 flex flex-wrap items-center gap-2 border-b border-border bg-surface px-3 py-2",
        className,
      )}
    >
      {onSearchChange && (
        <div className="relative">
          <Search className="absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search ?? ""}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="h-8 w-64 rounded-md border border-border bg-surface pl-7 pr-7 text-[13px] outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:bg-surface-hover"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
      )}
      {children}
      <div className="ml-auto flex items-center gap-2">{right}</div>
    </div>
  );
}

export function FilterChip({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string; count?: number }[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface px-2 text-[12.5px] text-foreground">
      <span className="text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent pr-1 text-[12.5px] font-medium outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
            {o.count !== undefined ? ` (${o.count})` : ""}
          </option>
        ))}
      </select>
    </label>
  );
}
