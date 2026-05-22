"use client";

import { useState, type FormEvent } from "react";
import { toast } from "@/hooks/use-toast";
import {
  createRoute,
  createRouteSchedule,
  type Route,
  type RouteSchedule,
} from "../../lib/tfd-api";

type CreateRouteDialogProps = {
  onClose: () => void;
  onCreated: (
    route: Route,
    schedules: RouteSchedule[],
  ) => Promise<void> | void;
  token: string;
};

type ScheduleForm = {
  defaultCapacity: string;
  departureTime: string;
  label: string;
  weekdays: number[];
};

type RouteForm = {
  destination: string;
  schedules: ScheduleForm[];
};

const weekdayOptions = [
  { label: "Dom", value: 0 },
  { label: "Seg", value: 1 },
  { label: "Ter", value: 2 },
  { label: "Qua", value: 3 },
  { label: "Qui", value: 4 },
  { label: "Sex", value: 5 },
  { label: "Sab", value: 6 },
];

const weekdaysMondayToFriday = [1, 2, 3, 4, 5];

const emptyRouteForm: RouteForm = {
  destination: "",
  schedules: [
    {
      defaultCapacity: "",
      departureTime: "06:00",
      label: "Manha",
      weekdays: weekdaysMondayToFriday,
    },
  ],
};

export function CreateRouteDialog({
  onClose,
  onCreated,
  token,
}: CreateRouteDialogProps) {
  const [form, setForm] = useState<RouteForm>(emptyRouteForm);
  const [isSaving, setIsSaving] = useState(false);

  function updateSchedule(
    index: number,
    field: keyof Omit<ScheduleForm, "weekdays">,
    value: string,
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      schedules: currentForm.schedules.map((schedule, scheduleIndex) =>
        scheduleIndex === index ? { ...schedule, [field]: value } : schedule,
      ),
    }));
  }

  function updateWeekday(index: number, weekday: number, checked: boolean) {
    setForm((currentForm) => ({
      ...currentForm,
      schedules: currentForm.schedules.map((schedule, scheduleIndex) => {
        if (scheduleIndex !== index) {
          return schedule;
        }

        const weekdays = checked
          ? [...schedule.weekdays, weekday]
          : schedule.weekdays.filter((value) => value !== weekday);

        return {
          ...schedule,
          weekdays: [...new Set(weekdays)].sort((a, b) => a - b),
        };
      }),
    }));
  }

  function addSchedule() {
    setForm((currentForm) => ({
      ...currentForm,
      schedules: [
        ...currentForm.schedules,
        {
          defaultCapacity: "",
          departureTime: "13:00",
          label: "Tarde",
          weekdays: weekdaysMondayToFriday,
        },
      ],
    }));
  }

  function removeSchedule(index: number) {
    setForm((currentForm) => ({
      ...currentForm,
      schedules: currentForm.schedules.filter(
        (_, scheduleIndex) => scheduleIndex !== index,
      ),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const destination = form.destination.trim();

    if (!destination) {
      toast({
        title: "Informe o destino da rota",
        variant: "destructive",
      });
      return;
    }

    if (form.schedules.length === 0) {
      toast({
        title: "Adicione pelo menos uma saida recorrente",
        variant: "destructive",
      });
      return;
    }

    for (const schedule of form.schedules) {
      const defaultCapacity = Number(schedule.defaultCapacity);

      if (!schedule.label.trim()) {
        toast({
          title: "Informe o nome de todas as saidas",
          variant: "destructive",
        });
        return;
      }

      if (!schedule.departureTime) {
        toast({
          title: "Informe o horario de todas as saidas",
          variant: "destructive",
        });
        return;
      }

      if (!Number.isInteger(defaultCapacity) || defaultCapacity <= 0) {
        toast({
          title: "Informe uma capacidade padrao valida para todas as saidas",
          variant: "destructive",
        });
        return;
      }

      if (schedule.weekdays.length === 0) {
        toast({
          title: "Selecione pelo menos um dia para cada saida",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSaving(true);

    try {
      const route = await createRoute(token, { destination });
      const schedules = await Promise.all(
        form.schedules.map((schedule) =>
          createRouteSchedule(token, {
            defaultCapacity: Number(schedule.defaultCapacity),
            departureTime: schedule.departureTime,
            label: schedule.label.trim(),
            routeId: route.id,
            weekdays: schedule.weekdays,
          }),
        ),
      );

      await onCreated(route, schedules);
      onClose();
    } catch (submitError) {
      toast({
        description:
          submitError instanceof Error
            ? submitError.message
            : "Nao foi possivel criar a rota.",
        title: "Erro ao criar rota",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/45 px-4 py-8 backdrop-blur-sm">
      <section className="max-h-full w-full max-w-3xl overflow-auto rounded-[calc(var(--radius)*5)] border border-border bg-background p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Rotas
            </p>
            <h2 className="mt-2 font-serif text-xl font-semibold text-foreground">
              Criar rota
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
              onChange={(event) =>
                setForm((currentForm) => ({
                  ...currentForm,
                  destination: event.target.value,
                }))
              }
              required
              type="text"
              value={form.destination}
            />
          </label>

          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-foreground">
                Saidas recorrentes
              </h3>
              <button
                className="rounded-md border border-border px-3 py-2 text-sm font-semibold text-muted-foreground"
                disabled={isSaving}
                onClick={addSchedule}
                type="button"
              >
                Adicionar saida
              </button>
            </div>

            {form.schedules.map((schedule, index) => (
              <div
                className="rounded-2xl border border-border bg-muted/50 p-4"
                key={index}
              >
                <div className="grid gap-4 md:grid-cols-[1fr_150px_150px]">
                  <label className="block text-sm font-medium text-foreground">
                    Nome
                    <input
                      className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
                      onChange={(event) =>
                        updateSchedule(index, "label", event.target.value)
                      }
                      required
                      type="text"
                      value={schedule.label}
                    />
                  </label>
                  <label className="block text-sm font-medium text-foreground">
                    Horario
                    <input
                      className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
                      onChange={(event) =>
                        updateSchedule(
                          index,
                          "departureTime",
                          event.target.value,
                        )
                      }
                      required
                      type="time"
                      value={schedule.departureTime}
                    />
                  </label>
                  <label className="block text-sm font-medium text-foreground">
                    Capacidade
                    <input
                      className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
                      min="1"
                      onChange={(event) =>
                        updateSchedule(
                          index,
                          "defaultCapacity",
                          event.target.value,
                        )
                      }
                      required
                      type="number"
                      value={schedule.defaultCapacity}
                    />
                  </label>
                </div>

                <fieldset className="mt-4">
                  <legend className="text-sm font-medium text-foreground">
                    Dias fixos
                  </legend>
                  <div className="mt-2 grid gap-2 sm:grid-cols-4 md:grid-cols-7">
                    {weekdayOptions.map((weekday) => (
                      <label
                        className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-muted-foreground"
                        key={weekday.value}
                      >
                        <input
                          checked={schedule.weekdays.includes(weekday.value)}
                          className="h-4 w-4 accent-[hsl(var(--primary))]"
                          onChange={(event) =>
                            updateWeekday(
                              index,
                              weekday.value,
                              event.target.checked,
                            )
                          }
                          type="checkbox"
                        />
                        {weekday.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                {form.schedules.length > 1 ? (
                  <button
                    className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive"
                    disabled={isSaving}
                    onClick={() => removeSchedule(index)}
                    type="button"
                  >
                    Remover saida
                  </button>
                ) : null}
              </div>
            ))}
          </div>

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
              {isSaving ? "Criando..." : "Criar rota"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
