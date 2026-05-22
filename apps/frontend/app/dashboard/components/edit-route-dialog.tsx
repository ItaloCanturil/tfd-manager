"use client";

import { useEffect, useState, type FormEvent } from "react";
import { toast } from "@/hooks/use-toast";
import {
  updateRoute,
  type Route,
  type UpdateRouteInput,
} from "../../lib/tfd-api";

type EditRouteDialogProps = {
  onClose: () => void;
  onSaved: (route: Route) => void;
  route: Pick<Route, "destination" | "id">;
  token: string;
};

export function EditRouteDialog({
  onClose,
  onSaved,
  route,
  token,
}: EditRouteDialogProps) {
  const [destination, setDestination] = useState(route.destination);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDestination(route.destination);
  }, [route.destination]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextDestination = destination.trim();

    if (!nextDestination) {
      toast({
        title: "Informe o destino da rota",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    const payload: UpdateRouteInput = {
      destination: nextDestination,
    };

    try {
      const updatedRoute = await updateRoute(token, route.id, payload);
      onSaved(updatedRoute);
      onClose();
    } catch (submitError) {
      toast({
        description:
          submitError instanceof Error
            ? submitError.message
            : "Nao foi possivel atualizar a rota.",
        title: "Erro ao atualizar rota",
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
              Editar rota
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

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-foreground">
            Destino
            <input
              className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
              onChange={(event) => setDestination(event.target.value)}
              required
              type="text"
              value={destination}
            />
          </label>

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
              className="h-10 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? "Salvando..." : "Salvar rota"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
