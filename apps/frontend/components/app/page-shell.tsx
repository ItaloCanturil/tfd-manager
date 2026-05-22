"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { roleLabels } from "@/app/lib/role-labels";
import type { AuthenticatedUser } from "@/app/lib/tfd-api";
import { cn } from "@/lib/utils";

export function PageShell({
  backHref = "/dashboard",
  backLabel = "TFD",
  children,
  contentClassName,
  onSignOut,
  session,
  title,
}: {
  backHref?: string;
  backLabel?: string;
  children: React.ReactNode;
  contentClassName?: string;
  onSignOut: () => void;
  session: AuthenticatedUser | null;
  title: string;
}) {
  const initials = useMemo(
    () =>
      session?.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") ?? "TF",
    [session],
  );

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,hsl(var(--muted)/0.5),transparent_26%),radial-gradient(circle_at_top_right,hsl(var(--primary)/0.16),transparent_28%)] text-foreground">
      <header className="border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-primary"
              href={backHref}
            >
              <ArrowLeft className="size-4" />
              {backLabel}
            </Link>
            <h1 className="mt-2 font-serif text-2xl font-semibold tracking-tight">
              {title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card/90 px-3 py-2 shadow-sm backdrop-blur">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {initials}
                </span>
                <span>
                  <span className="block text-sm font-semibold">{session.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {roleLabels[session.role]} - {session.username}
                  </span>
                </span>
              </div>
            ) : null}

            <Button onClick={onSignOut} type="button" variant="outline">
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className={cn("mx-auto w-full max-w-7xl px-6 py-6", contentClassName)}>
        {children}
      </div>
    </main>
  );
}
