"use client";

import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { deleteRoute, type Route } from "../../lib/tfd-api";

type DeleteRouteDialogProps = {
  onClose: () => void;
  onDeleted: (route: Pick<Route, "id">) => void;
  route: Pick<Route, "destination" | "id">;
  token: string;
};

export function DeleteRouteDialog({
  onClose,
  onDeleted,
  route,
  token,
}: DeleteRouteDialogProps) {
  const [isSaving, setIsSaving] = useState(false);

  async function handleDelete() {
    setIsSaving(true);

    try {
      const deletedRoute = await deleteRoute(token, route.id);
      onDeleted(deletedRoute);
      onClose();
    } catch (submitError) {
      toast({
        description:
          submitError instanceof Error
            ? submitError.message
            : "Nao foi possivel excluir a rota.",
        title: "Erro ao excluir rota",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/45 px-4 py-8 backdrop-blur-sm">
      <section className="max-h-full w-full max-w-xl overflow-auto rounded-[calc(var(--radius)*5)] border border-border bg-background p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Rotas
            </p>
            <h2 className="mt-2 font-serif text-xl font-semibold text-foreground">
              Excluir rota
            </h2>
          </div>
          <button
            className="h-9 rounded-md border border-border px-3 text-sm font-medium text-muted-foreground"
            disabled={isSaving}
            onClick={onClose}
            type="button"
          >
            Fechar
          </button>
        </div>

        <p className="text-sm leading-6 text-muted-foreground">
          Excluir rota{" "}
          <strong className="text-foreground">{route.destination}</strong>.
          Todas viagens e reservas ligadas tambem serao removidas.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            className="h-10 rounded-md border border-border px-4 text-sm font-medium text-muted-foreground"
            disabled={isSaving}
            onClick={onClose}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="h-10 rounded-md bg-destructive px-4 text-sm font-semibold text-destructive-foreground disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSaving}
            onClick={handleDelete}
            type="button"
          >
            {isSaving ? "Excluindo..." : "Excluir rota"}
          </button>
        </div>
      </section>
    </div>
  );
}
