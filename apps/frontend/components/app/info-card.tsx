import Link from "next/link";

export function InfoCard({
  href,
  label,
  value,
}: {
  href?: string;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-[calc(var(--radius)*3)] border border-border/70 bg-muted/35 px-4 py-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm font-semibold text-foreground">
        {href ? (
          <Link className="transition hover:text-primary" href={href}>
            {value}
          </Link>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
