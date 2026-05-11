import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav className={cn("flex items-center gap-1 text-[12px] text-muted-foreground", className)} aria-label="Breadcrumb">
      {items.map((c, i) => (
        <div key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="size-3 opacity-50" />}
          {c.to && i < items.length - 1 ? (
            <Link to={c.to} className="hover:text-foreground transition-colors">
              {c.label}
            </Link>
          ) : (
            <span className={cn(i === items.length - 1 && "text-foreground font-medium")}>{c.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  meta,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <div className="border-b border-border bg-surface px-5 py-3">
      {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} className="mb-1.5" />}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-[17px] font-semibold leading-6 text-foreground">{title}</h1>
          {subtitle && <p className="mt-0.5 text-[12.5px] text-muted-foreground">{subtitle}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
      {meta && <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12px] text-muted-foreground">{meta}</div>}
    </div>
  );
}
