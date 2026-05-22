"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastProps = {
  description?: string;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  title: string;
  variant?: "default" | "destructive";
};

export function Toast({
  description,
  onOpenChange,
  open = true,
  title,
  variant = "default",
}: ToastProps) {
  React.useEffect(() => {
    if (!open) {
      return;
    }

    const timeout = window.setTimeout(() => {
      onOpenChange?.(false);
    }, 2600);

    return () => window.clearTimeout(timeout);
  }, [onOpenChange, open]);

  return (
    <div
      className={cn(
        "pointer-events-auto relative w-full overflow-hidden rounded-2xl border p-4 shadow-xl backdrop-blur transition-all",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full",
        "data-[state=open]:animate-in data-[state=open]:slide-in-from-top-full sm:data-[state=open]:slide-in-from-bottom-full",
        variant === "destructive"
          ? "border-destructive/30 bg-destructive text-destructive-foreground"
          : "border-border bg-card text-card-foreground",
      )}
      data-state={open ? "open" : "closed"}
      role="status"
    >
      <div className="pr-8">
        <p className="text-sm font-semibold">{title}</p>
        {description ? (
          <p
            className={cn(
              "mt-1 text-sm",
              variant === "destructive"
                ? "text-destructive-foreground/90"
                : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      <button
        aria-label="Fechar aviso"
        className={cn(
          "absolute right-3 top-3 rounded-md p-1 transition hover:bg-black/5",
          variant === "destructive" ? "hover:bg-white/10" : "",
        )}
        onClick={() => onOpenChange?.(false)}
        type="button"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ToastViewport({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex flex-col-reverse gap-3 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:max-w-[420px]">
      {children}
    </div>
  );
}
